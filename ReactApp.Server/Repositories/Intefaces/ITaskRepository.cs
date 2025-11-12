namespace ReactApp.Server.Repositories.Intefaces
{
    public interface ITaskRepository
    {
        Task<IEnumerable<ReactApp.Server.Entities.Task>> GetAllAsync();
        Task<ReactApp.Server.Entities.Task> GetByIdAsync(Guid id);
        Task AddAsync(ReactApp.Server.Entities.Task task);
        Task UpdateAsync(ReactApp.Server.Entities.Task task);
        Task DeleteAsync(Guid id);
    }
}
