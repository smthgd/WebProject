using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Utilities;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        builder => builder.WithOrigins("*")
                          .AllowAnyHeader()
                          .AllowAnyMethod());
});

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi(); // Возможно это не надо

builder.Services.AddRazorPages();
builder.Services.AddControllers();

builder.Services.AddSingleton<WebSocketHandler>();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<WebProjectDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

var hashKey = builder.Configuration["HashKey"];
builder.Services.AddSingleton(new HashingService(hashKey));

var app = builder.Build();


// Configure the HTTP request pipeline.
// if (app.Environment.IsDevelopment())
// {
//     app.MapOpenApi(); // Возможно это не надо
// }

if (!app.Environment.IsDevelopment())
{

    var application = app.Services.CreateScope().ServiceProvider.GetRequiredService<WebProjectDbContext>();
    var pendingMigrations = await application.Database.GetPendingMigrationsAsync();
    if (pendingMigrations != null)
        await application.Database.MigrateAsync();
    app.UseExceptionHandler("/Error");
    app.UseHsts();
}

app.UseSwagger();
app.UseSwaggerUI();
app.UseRouting();
app.UseCors("AllowFrontend");
app.UseAuthorization();

app.MapControllers();
app.MapRazorPages();

app.UseWebSockets();

app.Map("/ws", async (HttpContext context, WebSocketHandler webSocketHandler) =>
{
    if (context.WebSockets.IsWebSocketRequest)
    {
        var webSocket = await context.WebSockets.AcceptWebSocketAsync();
        var random = new Random();
        int userId = (int)(DateTime.UtcNow.Ticks % 1000000000) + random.Next(1, 1000);
        await webSocketHandler.HandleWebSocket(webSocket, userId);
        await webSocketHandler.SendMessage(userId, $"userId: {userId}");
    }
});

// Возможно это не надо
// var summaries = new[]
// {
//     "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
// };

// app.MapGet("/weatherforecast", () =>
// {
//     var forecast =  Enumerable.Range(1, 5).Select(index =>
//         new WeatherForecast
//         (
//             DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
//             Random.Shared.Next(-20, 55),
//             summaries[Random.Shared.Next(summaries.Length)]
//         ))
//         .ToArray();
//     return forecast;
// })
// .WithName("GetWeatherForecast");

app.Run();

// record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
// {
//     public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
// }
