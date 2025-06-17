using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using backend.Data;
using Microsoft.EntityFrameworkCore;

namespace DefaultNamespace;

public class RoomController : ControllerBase
{
    private static Dictionary<Room, List<Movie>> rooms = new Dictionary<Room, List<Movie>>();
    
    private static Dictionary<int, List<int>> watchedMovies = new Dictionary<int, List<int>>();
    
    private static Dictionary<int, List<int>> likedMovies = new Dictionary<int, List<int>>();
    
    private readonly WebProjectDbContext _context;

    public RoomController(WebProjectDbContext context)
    {
        _context = context;
    }
    
    [HttpPost("create")]
    public async Task<IActionResult> CreateRoom()
    {
        var random = new Random();
        int roomCode = (int)(DateTime.UtcNow.Ticks % 1000000000) + random.Next(1, 1000);

        var room = new Room 
        { 
            CreationDate = DateTime.UtcNow,
            Id = roomCode,
        };

        _context.Rooms.Add(room);
        await _context.SaveChangesAsync();

        rooms[room] = new List<Movie>();

        return Ok(roomCode);
    }
    
    [HttpPost("join/{roomCode}/{userId}")]
    public async Task<IActionResult> JoinRoom(int roomCode, int userId)
    {
        var room = rooms.Keys.FirstOrDefault(r => r.Id == roomCode);
        
        if (room == null)
        {
            return NotFound("Room not found");
        }      

        var roomUser = new RoomUser
        {
            RoomId = room.Id,
            UserId =+ 1
        };
        
        _context.RoomUsers.Add(roomUser);
        
        try
        {
            await _context.SaveChangesAsync();
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
        }

        return Ok();
    }
    
    [HttpGet("{roomCode}/movies")]
    public async Task<IActionResult> GetMovies(int roomCode)
    {
        var room = rooms.Keys.FirstOrDefault(r => r.Id == roomCode);

        if (room == null)
        {
            return NotFound("Room not found");
        }

        using (var httpClient = new HttpClient())
        {
            var apiKey = "KTZV0EX-47647JH-JDRJYQ8-HSENZ44";
            httpClient.DefaultRequestHeaders.Add("X-API-KEY", apiKey);
            var response = await httpClient.GetAsync("https://api.kinopoisk.dev/v1.3/movie?limit=30");

            if (response.IsSuccessStatusCode)
            {
                var jsonResponse = await response.Content.ReadAsStringAsync();
                var moviesResponse = JsonSerializer.Deserialize<KinopoiskResponse>(jsonResponse, new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });

                if (moviesResponse != null && moviesResponse.Docs != null)
                {
                    var movies = moviesResponse.Docs.Select(m => new Movie
                    {
                        Id = m.Id,
                        Name = m.Name,
                        Rating = m.Rating.Kp,
                        PosterUrl = m.Poster.Url
                    }).ToList();

                    rooms[room] = movies;

                    return Ok(movies);
                }
            }

            return StatusCode((int)response.StatusCode, "Failed to load movies");
        }
    }
    
    [HttpGet("{roomCode}/next-movie")]
    public IActionResult GetNextMovie(int roomCode, [FromQuery] int userId)
    {
        var room = rooms.Keys.FirstOrDefault(r => r.Id == roomCode);

        if (room == null)
        {
            return NotFound("Room not found");
        }

        List<int> watchedMoviesList;

        if (!watchedMovies.TryGetValue(userId, out watchedMoviesList))
        {
            watchedMoviesList = new List<int>();
        }

        var movies = rooms[room];

        var nextMovie = movies.FirstOrDefault(m => !watchedMoviesList.Contains(m.Id));

        if (nextMovie != null)
        {
            return Ok(nextMovie);
        }

        return NotFound("No more movies available");
    }

    [HttpPost("{roomCode}/watched-movies")]
    public async Task<IActionResult> AddWatchedMovie(int roomCode, [FromBody] int movieId, [FromQuery] int userId)
    {
        if (!rooms.Keys.Any(room => room.Id == roomCode))
        {
            return NotFound("Room not found");
        }

        if (!watchedMovies.ContainsKey(userId))
        {
            watchedMovies[userId] = new List<int>();
        }

        watchedMovies[userId].Add(movieId);

        return Ok("Movie added in watched");
    }
    
    [HttpPost("{roomCode}/match-checking")]
    public async Task<IActionResult> MatchChecking(int roomCode, [FromBody] int movieId, [FromQuery] int userId)
    {
        var room = rooms.Keys.FirstOrDefault(r => r.Id == roomCode);
        
        if (room == null)
        {
            return NotFound("Room not found");
        }

        if (!likedMovies.ContainsKey(userId))
        {
            likedMovies[userId] = new List<int>();
        }

        likedMovies[userId].Add(movieId);

        // Проверка на совпадение
        if (likedMovies.Values.All(choices => choices.Contains(movieId)) && likedMovies.Count != 1)
        {
            // Отправка уведомления через WebSocket
            var message = $"Match found for movie ID: {movieId}";

            // Получение списка фильмов из комнаты
            if (rooms.TryGetValue(room, out var movies))
            {
                // Поиск фильма по movieId
                var movie = movies.FirstOrDefault(m => m.Id == movieId);

                if (movie != null)
                {
                    // Создание объекта MatchedFilm с реальными значениями
                    var matchedFilm = new Movie
                    {
                        Id = movie.Id,
                        Name = movie.Name,
                        Rating = movie.Rating,
                        PosterUrl = movie.PosterUrl
                    };

                    // Добавление фильма в контекст
                    _context.MatchedFilms.Add(matchedFilm);
                    await _context.SaveChangesAsync();

                    // Установка связи с комнатой
                    room.MatchedFilmId = movie.Id;
                    await _context.SaveChangesAsync();

                    return Ok("Match found!");
                }
                else
                {
                    return NotFound("Movie not found");
                }
            }
        }

        return Ok("Swipe recorded");
    }
}
