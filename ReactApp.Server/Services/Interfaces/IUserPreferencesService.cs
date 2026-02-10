using ReactApp.Server.Dto;

namespace ReactApp.Server.Services.Interfaces
{
    public interface IUserPreferencesService
    {
        Task<UserPreferencesDto> GetPreferencesAsync(string userId);
        Task<UserPreferencesDto> UpdatePreferencesAsync(string userId, UpdateUserPreferencesDto dto);
    }
}
