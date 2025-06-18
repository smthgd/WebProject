namespace DefaultNamespace;

public class Movie
{
    public int Id { get; set; }

    public string Name { get; set; }
    
    public double Rating { get; set; }
    
    public string PosterUrl { get; set; }

    public ICollection<Room> Rooms { get; set; }
}

public class KinopoiskResponse
{
    public List<KinopoiskMovie> Docs { get; set; }
}

public class KinopoiskMovie
{
    public int Id { get; set; }

    public string Name { get; set; }

    public Rating Rating { get; set; }

    public Poster Poster { get; set; }
}

public class Rating
{
    public double Kp { get; set; }
}

public class Poster
{
    public string Url { get; set; }
}