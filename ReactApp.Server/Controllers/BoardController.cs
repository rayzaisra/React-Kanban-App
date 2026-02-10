using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

using ReactApp.Server.Dto;
using ReactApp.Server.Services.Interfaces;

namespace ReactApp.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BoardController : ControllerBase
    {
        private readonly IBoardService _boardService;

        public BoardController(IBoardService boardService)
        {
            _boardService = boardService;
        }

        [HttpGet("columns")]
        public async Task<IActionResult> GetColumns()
        {
            var columns = await _boardService.GetColumnsAsync();
            return Ok(columns);
        }

        [HttpPost("columns")]
        public async Task<IActionResult> CreateColumn([FromBody] CreateBoardColumnDto dto)
        {
            var column = await _boardService.CreateColumnAsync(dto);
            return Ok(column);
        }

        [HttpPut("columns/{id}")]
        public async Task<IActionResult> UpdateColumn(Guid id, [FromBody] UpdateBoardColumnDto dto)
        {
            await _boardService.UpdateColumnAsync(id, dto);
            return NoContent();
        }

        [HttpDelete("columns/{id}")]
        public async Task<IActionResult> DeleteColumn(Guid id)
        {
            await _boardService.DeleteColumnAsync(id);
            return NoContent();
        }

        [HttpPut("columns/reorder")]
        public async Task<IActionResult> ReorderColumns([FromBody] List<Guid> columnIds)
        {
            await _boardService.ReorderColumnsAsync(columnIds);
            return NoContent();
        }
    }
}
