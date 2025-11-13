using Microsoft.EntityFrameworkCore;

using ReactApp.Server.Entities;
using ReactApp.Server.Repositories;
using ReactApp.Server.Repositories.Intefaces;
using ReactApp.Server.Services;
using ReactApp.Server.Services.Interfaces;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// ADD THIS: Enable CORS
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
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();


builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(connectionString));

AppContext.SetSwitch("Npgsql.DisableDateTimeInfinityConversions", true);
builder.Services.AddScoped<ITaskRepository, TaskRepository>();
builder.Services.AddScoped<ITaskService, TaskService>();

var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

if (app.Environment.IsDevelopment() || app.Environment.IsProduction())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}


app.UseHttpsRedirection();
// ADD THIS LINE
app.UseCors("AllowAll");
app.UseAuthorization();

app.MapControllers();


app.MapFallbackToFile("/index.html");

app.Run();
