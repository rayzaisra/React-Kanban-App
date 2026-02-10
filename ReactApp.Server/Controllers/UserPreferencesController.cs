using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

using ReactApp.Server.Dto;
using ReactApp.Server.Services.Interfaces;

namespace ReactApp.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserPreferencesController : ControllerBase
    {
        private readonly IUserPreferencesService _service;

        public UserPreferencesController(IUserPreferencesService service)
        {
            _service = service;
        }

        [HttpGet("{userId}")]
        public async Task<IActionResult> GetPreferences(string userId)
        {
            var prefs = await _service.GetPreferencesAsync(userId);
            if (prefs == null)
            {
                // Return default preferences
                return Ok(new UserPreferencesDto
                {
                    UserId = userId,
                    PreferredView = "kanban",
                    BoardSettings = new { }
                });
            }
            return Ok(prefs);
        }

        [HttpPost("{userId}")]
        public async Task<IActionResult> UpdatePreferences(
            string userId,
            [FromBody] UpdateUserPreferencesDto dto)
        {
            var prefs = await _service.UpdatePreferencesAsync(userId, dto);
            return Ok(prefs);
        }
    }
}
