using ReactApp.Server.Dto;

namespace ReactApp.Server.Services.Interfaces
{
    public interface IBoardService
    {
        Task<IEnumerable<BoardColumnDto>> GetColumnsAsync();
        Task<BoardColumnDto> CreateColumnAsync(CreateBoardColumnDto dto);
        System.Threading.Tasks.Task UpdateColumnAsync(Guid id, UpdateBoardColumnDto dto);
        System.Threading.Tasks.Task DeleteColumnAsync(Guid id);
        System.Threading.Tasks.Task ReorderColumnsAsync(List<Guid> columnIds);
    }
}
