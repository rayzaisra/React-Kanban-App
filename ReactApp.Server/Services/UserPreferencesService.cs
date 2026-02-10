using Microsoft.EntityFrameworkCore;

using ReactApp.Server.Dto;
using ReactApp.Server.Entities;
using ReactApp.Server.Services.Interfaces;

using System.Text.Json;

namespace ReactApp.Server.Services
{
    public class UserPreferencesService : IUserPreferencesService
    {
        private readonly AppDbContext _context;

        public UserPreferencesService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<UserPreferencesDto> GetPreferencesAsync(string userId)
        {
            var prefs = await _context.UserPreferences.FirstOrDefaultAsync(p => p.UserId == userId);

            if (prefs == null) return null;

            object boardSettings = null;
            if (!string.IsNullOrEmpty(prefs.BoardSettings))
            {
                try
                {
                    boardSettings = JsonSerializer.Deserialize<object>(prefs.BoardSettings);
                }
                catch
                {
                    boardSettings = new { };
                }
            }

            return new UserPreferencesDto
            {
                Id = prefs.Id,
                UserId = prefs.UserId,
                PreferredView = prefs.PreferredView,
                BoardSettings = boardSettings
            };
        }

        public async Task<UserPreferencesDto> UpdatePreferencesAsync(
            string userId,
            UpdateUserPreferencesDto dto)
        {
            var prefs = await _context.UserPreferences
                .FirstOrDefaultAsync(p => p.UserId == userId);

            if (prefs == null)
            {
                // Create new preferences
                prefs = new UserPreferences
                {
                    Id = Guid.NewGuid(),
                    UserId = userId,
                    PreferredView = dto.PreferredView,
                    BoardSettings = JsonSerializer.Serialize(dto.BoardSettings ?? new { }),
                    CreatedAt = DateTime.Now
                };
                _context.UserPreferences.Add(prefs);
            }
            else
            {
                // Update existing preferences
                prefs.PreferredView = dto.PreferredView;
                prefs.BoardSettings = JsonSerializer.Serialize(dto.BoardSettings ?? new { });
                prefs.UpdatedAt = DateTime.Now;
            }

            await _context.SaveChangesAsync();

            return new UserPreferencesDto
            {
                Id = prefs.Id,
                UserId = prefs.UserId,
                PreferredView = prefs.PreferredView,
                BoardSettings = dto.BoardSettings
            };
        }
    }
}

