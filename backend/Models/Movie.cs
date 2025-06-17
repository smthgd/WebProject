namespace DefaultNamespace;

public class Movie
{
    public int Id { get; set; }

    public string Name { get; set; }
    
    public double Rating { get; set; }
    
    public string PosterUrl { get; set; }

    public ICollection<Room> Rooms { get; set; }
}