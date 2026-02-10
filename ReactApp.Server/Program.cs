using Microsoft.EntityFrameworkCore;

using ReactApp.Server.Entities;
using ReactApp.Server.Repositories;
using ReactApp.Server.Repositories.Intefaces;
using ReactApp.Server.Services;
using ReactApp.Server.Services.Interfaces;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Enable CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        policy =>
        {
            policy.AllowAnyOrigin()
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

var connectionString = Environment.GetEnvironmentVariable("CONNECTION_STRING")
    ?? builder.Configuration.GetConnectionString("DefaultConnection");

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(connectionString, sqlOptions =>
    {
        sqlOptions.CommandTimeout(120);
    }));

builder.Services.AddScoped<ITaskRepository, TaskRepository>();
builder.Services.AddScoped<ITaskService, TaskService>();
builder.Services.AddScoped<IBoardService, BoardService>();
builder.Services.AddScoped<IUserPreferencesService, UserPreferencesService>();

var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

if (app.Environment.IsDevelopment() || app.Environment.IsProduction())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// ⚠️ IMPORTANT: UseCors MUST come BEFORE UseHttpsRedirection and UseAuthorization
app.UseCors("AllowAll");

app.UseHttpsRedirection();
app.UseAuthorization();

app.MapControllers();
app.MapFallbackToFile("/index.html");

app.Run();