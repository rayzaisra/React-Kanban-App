using ReactApp.Server.Dto;

namespace ReactApp.Server.Services.Interfaces
{
    public interface ITaskService
    {
        Task<IEnumerable<TaskDto>> GetAllAsync();
        Task<TaskDto> GetByIdAsync(Guid id);
        Task<TaskDto> CreateAsync(CreateTaskDto dto);
        System.Threading.Tasks.Task UpdateAsync(Guid id, UpdateTaskDto dto);
        System.Threading.Tasks.Task DeleteAsync(Guid id);
        Task<PaginatedTasksResultDto> GetPaginatedWithCountAsync(
            int page,
            int pageSize,
            string sortBy = "createdAt",
            string sortOrder = "desc");
        Task<PaginatedTasksResultDto> SearchTasksAsync(
            string searchTerm,
            int page,
            int pageSize,
            string taskType = "",
            string status = "",
            int? priority = null,
            bool? overdue = null);
        Task<object> GetAnalyticsSummaryAsync();
        Task<object> GetTasksByTypeAsync();
        Task<object> GetTasksByPriorityAsync();
    }
}

