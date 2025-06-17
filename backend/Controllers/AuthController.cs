using backend.Data;
using Microsoft.AspNetCore.Mvc;

namespace DefaultNamespace;

public class AuthController : ControllerBase
{
    private readonly WebProjectDbContext _context;

    public AuthController(WebProjectDbContext context)
    {
        _context = context;
    }
}