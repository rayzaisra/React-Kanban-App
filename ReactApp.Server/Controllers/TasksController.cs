using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

using ReactApp.Server.Dto;
using ReactApp.Server.Services.Interfaces;

namespace ReactApp.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TasksController : ControllerBase
    {
        private readonly ITaskService _service;
        private readonly IBoardService _boardService;
        private readonly IUserPreferencesService _preferencesService;

        public TasksController(ITaskService service,
            IBoardService boardService,
            IUserPreferencesService preferencesService)
        {
            _service = service;
            _boardService = boardService;
            _preferencesService = preferencesService;
        }
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var tasks = await _service.GetAllAsync();
            return Ok(tasks);
        }

        [HttpGet("paginated")]
        public async Task<ActionResult<PaginatedTasksResponse>> GetPaginated(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] string sortBy = "createdAt",
            [FromQuery] string sortOrder = "desc")
        {
            page = Math.Max(1, page);
            pageSize = Math.Clamp(pageSize, 1, 100);

            var result = await _service.GetPaginatedWithCountAsync(page, pageSize, sortBy, sortOrder);

            var hasMore = (page * pageSize) < result.TotalCount;

            return Ok(new PaginatedTasksResponse
            {
                Tasks = result.Tasks,
                HasMore = hasMore,
                CurrentPage = page,
                PageSize = pageSize,
                TotalCount = result.TotalCount
            });
        }

        [HttpGet("search")]
        public async Task<ActionResult<PaginatedTasksResponse>> Search(
            [FromQuery] string searchTerm = "",
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] string taskType = "",
            [FromQuery] string status = "",
            [FromQuery] int? priority = null,
            [FromQuery] bool? overdue = null)
        {
            page = Math.Max(1, page);
            pageSize = Math.Clamp(pageSize, 1, 100);

            var result = await _service.SearchTasksAsync(
                searchTerm, page, pageSize, taskType, status, priority, overdue);

            var hasMore = (page * pageSize) < result.TotalCount;

            return Ok(new PaginatedTasksResponse
            {
                Tasks = result.Tasks,
                HasMore = hasMore,
                CurrentPage = page,
                PageSize = pageSize,
                TotalCount = result.TotalCount
            });
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var task = await _service.GetByIdAsync(id);
            if (task == null) return NotFound();
            return Ok(task);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateTaskDto dto)
        {
            var task = await _service.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = task.Id }, task);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] UpdateTaskDto dto)
        {
            try
            {
                await _service.UpdateAsync(id, dto);
                return NoContent();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[ERROR] Update failed: {ex.Message}\n{ex.StackTrace}");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            await _service.DeleteAsync(id);
            return NoContent();
        }

        // Analytics endpoints
        [HttpGet("analytics/summary")]
        public async Task<IActionResult> GetAnalyticsSummary()
        {
            var summary = await _service.GetAnalyticsSummaryAsync();
            return Ok(summary);
        }

        [HttpGet("analytics/by-type")]
        public async Task<IActionResult> GetTasksByType()
        {
            var data = await _service.GetTasksByTypeAsync();
            return Ok(data);
        }

        [HttpGet("analytics/by-priority")]
        public async Task<IActionResult> GetTasksByPriority()
        {
            var data = await _service.GetTasksByPriorityAsync();
            return Ok(data);
        }
    }
}
