using backend.Data;
using backend.Utilities;
using backend.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DefaultNamespace;

public class AuthController : ControllerBase
{
    private readonly WebProjectDbContext _context;
    
    private readonly HashingService _hashingService;

    public AuthController(WebProjectDbContext context, HashingService hashingService)
    {
        _context = context;
        _hashingService = hashingService;
    }
    
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] UserRegistrationDto registrationDto)
    {
        if (await _context.Users.AnyAsync(u => u.Username == registrationDto.Username))
        {
            return BadRequest("Username already exists");
        }

        var user = new User
        {
            Username = registrationDto.Username,
            Email = registrationDto.Email,
            PasswordHash = _hashingService.HashPassword(registrationDto.Password),
            RegistrationDate = DateTime.UtcNow
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return Ok("User registered successfully");
    }
    
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] UserRegistrationDto loginDto)
    {
        var user = await _context.Users.SingleOrDefaultAsync(u => u.Email == loginDto.Email);
    
        if (user == null)
        {
            return Unauthorized("Invalid username or password");
        }

        if (!_hashingService.VerifyPassword(loginDto.Password, user.PasswordHash))
        {
            return Unauthorized("Invalid password");
        }

        var userData = new
        {
            userName = user.Username,
            email = user.Email 
        };

        return Ok(userData);
    }
}