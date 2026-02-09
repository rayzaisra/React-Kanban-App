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

        public TasksController(ITaskService service)
        {
            _service = service;
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
     [FromQuery] int pageSize = 10)
        {
            page = Math.Max(1, page);
            pageSize = Math.Clamp(pageSize, 1, 100);

            var result = await _service.GetPaginatedWithCountAsync(page, pageSize);

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
            [FromQuery] int pageSize = 10)
        {
            page = Math.Max(1, page);
            pageSize = Math.Clamp(pageSize, 1, 100);

            var result = await _service.SearchTasksAsync(searchTerm, page, pageSize);

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
    }
}
