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


builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();


builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

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
// ✅ If you serve React frontend from wwwroot
app.UseDefaultFiles();
app.UseStaticFiles();

app.MapFallbackToFile("/index.html");

app.Run();
