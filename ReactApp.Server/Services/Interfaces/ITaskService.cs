using ReactApp.Server.Dto;

namespace ReactApp.Server.Services.Interfaces
{
    public interface ITaskService
    {
        Task<IEnumerable<TaskDto>> GetAllAsync();
        Task<TaskDto> GetByIdAsync(Guid id);
        Task<TaskDto> CreateAsync(CreateTaskDto dto);
        Task UpdateAsync(Guid id, UpdateTaskDto dto);
        Task DeleteAsync(Guid id);
    }
}
