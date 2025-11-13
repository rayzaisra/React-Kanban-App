using ReactApp.Server.Dto;
using ReactApp.Server.Entities;
using ReactApp.Server.Repositories.Intefaces;
using ReactApp.Server.Services.Interfaces;

namespace ReactApp.Server.Services
{
    public class TaskService : ITaskService
    {
        private readonly ITaskRepository _repository;

        public TaskService(ITaskRepository repository)
        {
            _repository = repository;
        }

        public async Task<IEnumerable<TaskDto>> GetAllAsync()
        {
            var tasks = await _repository.GetAllAsync();
            return tasks.Select(t => MapToDto(t));
        }

        public async Task<TaskDto> GetByIdAsync(Guid id)
        {
            var task = await _repository.GetByIdAsync(id);
            return task != null ? MapToDto(task) : null;
        }

        public async Task<TaskDto> CreateAsync(CreateTaskDto dto)
        {
            var requestDate = DateTime.Now;
            var dueDate = DateTime.Now;
            if (!string.IsNullOrEmpty(dto.RequestDate))
            {
                requestDate = DateTime.Parse(dto.RequestDate);  // Kind=Unspecified
            }

            if (!string.IsNullOrEmpty(dto.DueDate))
            {
                dueDate = DateTime.Parse(dto.DueDate);
            }


            var task = new Entities.Task
            {
                Id = Guid.NewGuid(),
                Title = dto.Title,
                Description = dto.Description,
                RequestedBy = dto.RequestedBy,
                // Strip Kind for DB compatibility (keeps value as-is)
                RequestDate = requestDate,

                DueDate = dueDate,
                Status = Status.ToDo,
                IsCompleted = false,
                // Fix for UtcNow: Strip UTC flag (value remains UTC time, but DB sees it as local/unspecified)
                CreatedAt = DateTime.Now
            };

            await _repository.AddAsync(task);
            return MapToDto(task);
        }

        public async System.Threading.Tasks.Task UpdateAsync(Guid id, UpdateTaskDto dto)
        {
            var task = await _repository.GetByIdAsync(id);
            if (task == null) throw new Exception("Task not found");

            task.Title = dto.Title ?? task.Title;
            task.Description = dto.Description ?? task.Description;
            task.RequestedBy = dto.RequestedBy ?? task.RequestedBy;
            //task.RequestDate = dto.RequestDate != default ? dto.RequestDate : task.RequestDate;
            //task.DueDate = dto.DueDate ?? task.DueDate;
            // PARSE STRING → DateTime (Kind=Unspecified)
            if (!string.IsNullOrEmpty(dto.RequestDate))
            {
                task.RequestDate = DateTime.Parse(dto.RequestDate);  // Kind=Unspecified
            }

            if (!string.IsNullOrEmpty(dto.DueDate))
            {
                task.DueDate = DateTime.Parse(dto.DueDate);
            }
            else
            {
                task.DueDate = null;
            }

            // Apply logic
            // ← MAP STRING TO ENUM
            task.Status = dto.Status switch
            {
                "ToDo" => Status.ToDo,
                "InProgress" => Status.InProgress,
                "Done" => Status.Done,
                _ => Status.ToDo
            };
            task.IsCompleted = dto.IsCompleted;
            // APPLY LOGIC: Only override if needed
            if (task.Status == Status.Done && !task.IsCompleted)
            {
                task.IsCompleted = true;
            }
            else if (task.IsCompleted && task.Status != Status.Done)
            {
                task.Status = Status.Done;  // Only force Done if IsCompleted = true
            }

            await _repository.UpdateAsync(task);
        }

        public async System.Threading.Tasks.Task DeleteAsync(Guid id)
        {
            await _repository.DeleteAsync(id);
        }

        private TaskDto MapToDto(Entities.Task task)
        {
            return new TaskDto
            {
                Id = task.Id,
                Title = task.Title,
                Description = task.Description,
                RequestedBy = task.RequestedBy,
                RequestDate = task.RequestDate,
                DueDate = task.DueDate,
                Status = task.Status,
                IsCompleted = task.IsCompleted,
                CreatedAt = task.CreatedAt
            };
        }
    }
}
