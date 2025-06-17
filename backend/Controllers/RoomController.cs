using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using backend.Data;
using Microsoft.EntityFrameworkCore;

namespace DefaultNamespace;

public class RoomController : ControllerBase
{
    private static Dictionary<Room, List<Movie>> rooms = new Dictionary<Room, List<Movie>>();
    
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
}