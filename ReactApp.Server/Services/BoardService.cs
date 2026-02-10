using Microsoft.EntityFrameworkCore;

using ReactApp.Server.Dto;
using ReactApp.Server.Entities;
using ReactApp.Server.Services.Interfaces;

namespace ReactApp.Server.Services
{
    public class BoardService : IBoardService
    {
        private readonly AppDbContext _context;

        public BoardService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<BoardColumnDto>> GetColumnsAsync()
        {
            var columns = await _context.BoardColumns
                .Where(c => c.IsActive)
                .OrderBy(c => c.DisplayOrder)
                .ToListAsync();

            return columns.Select(c => new BoardColumnDto
            {
                Id = c.Id,
                Name = c.Name,
                StatusValue = c.StatusValue,
                DisplayOrder = c.DisplayOrder,
                Color = c.Color,
                WipLimit = c.WipLimit,
                IsActive = c.IsActive
            });
        }

        public async Task<BoardColumnDto> CreateColumnAsync(CreateBoardColumnDto dto)
        {
            var column = new BoardColumn
            {
                Id = Guid.NewGuid(),
                Name = dto.Name,
                StatusValue = dto.StatusValue,
                DisplayOrder = dto.DisplayOrder,
                Color = dto.Color,
                WipLimit = dto.WipLimit,
                IsActive = true,
                CreatedAt = DateTime.Now
            };

            _context.BoardColumns.Add(column);
            await _context.SaveChangesAsync();

            return new BoardColumnDto
            {
                Id = column.Id,
                Name = column.Name,
                StatusValue = column.StatusValue,
                DisplayOrder = column.DisplayOrder,
                Color = column.Color,
                WipLimit = column.WipLimit,
                IsActive = column.IsActive
            };
        }

        public async System.Threading.Tasks.Task UpdateColumnAsync(Guid id, UpdateBoardColumnDto dto)
        {
            var column = await _context.BoardColumns.FindAsync(id);
            if (column == null) throw new Exception("Column not found");

            column.Name = dto.Name;
            column.DisplayOrder = dto.DisplayOrder;
            column.Color = dto.Color;
            column.WipLimit = dto.WipLimit;
            column.IsActive = dto.IsActive;
            column.UpdatedAt = DateTime.Now;

            await _context.SaveChangesAsync();
        }

        public async System.Threading.Tasks.Task DeleteColumnAsync(Guid id)
        {
            var column = await _context.BoardColumns.FindAsync(id);
            if (column == null) return;

            // Soft delete
            column.IsActive = false;
            column.UpdatedAt = DateTime.Now;

            await _context.SaveChangesAsync();
        }

        public async System.Threading.Tasks.Task ReorderColumnsAsync(List<Guid> columnIds)
        {
            for (int i = 0; i < columnIds.Count; i++)
            {
                var column = await _context.BoardColumns.FindAsync(columnIds[i]);
                if (column != null)
                {
                    column.DisplayOrder = i + 1;
                    column.UpdatedAt = DateTime.Now;
                }
            }

            await _context.SaveChangesAsync();
        }
    }
}
