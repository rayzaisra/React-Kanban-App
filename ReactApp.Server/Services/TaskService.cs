using Microsoft.EntityFrameworkCore;

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
                requestDate = DateTime.Parse(dto.RequestDate);
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
                RequestDate = requestDate,
                DueDate = dueDate,
                Status = Status.ToDo,
                IsCompleted = false,
                CreatedAt = DateTime.Now,
                UpdatedAt = null,
                TaskType = dto.TaskType ?? "Enhance" // CHANGED: Direct string assignment
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

            if (!string.IsNullOrEmpty(dto.RequestDate))
            {
                task.RequestDate = DateTime.Parse(dto.RequestDate);
            }

            if (!string.IsNullOrEmpty(dto.DueDate))
            {
                task.DueDate = DateTime.Parse(dto.DueDate);
            }
            else
            {
                task.DueDate = null;
            }

            // CHANGED: Direct string assignment
            if (!string.IsNullOrEmpty(dto.TaskType))
            {
                task.TaskType = dto.TaskType;
            }

            task.Status = dto.Status switch
            {
                "ToDo" => Status.ToDo,
                "InProgress" => Status.InProgress,
                "Done" => Status.Done,
                _ => Status.ToDo
            };
            task.IsCompleted = dto.IsCompleted;

            if (task.Status == Status.Done && !task.IsCompleted)
            {
                task.IsCompleted = true;
            }
            else if (task.IsCompleted && task.Status != Status.Done)
            {
                task.Status = Status.Done;
            }

            task.UpdatedAt = DateTime.Now;

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
                CreatedAt = task.CreatedAt,
                UpdatedAt = task.UpdatedAt,
                TaskType = task.TaskType ?? "Enhance" // CHANGED: Direct assignment with default
            };
        }
        public async Task<PaginatedTasksResultDto> GetPaginatedWithCountAsync(int page, int pageSize)
        {
            var query = _repository.GetQueryable(); // We'll add this in a sec

            var allData = await query.ToListAsync();

            var totalCount = allData.Count;

            var tasks = allData
                .OrderBy(x => x.Status)
                .ThenByDescending(x => x.DueDate)
                .ThenByDescending(x => x.RequestDate)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToList();

            var taskDtos = tasks.Select(MapToDto);

            return new PaginatedTasksResultDto
            {
                Tasks = taskDtos,
                TotalCount = totalCount
            };
        }

        public async Task<PaginatedTasksResultDto> SearchTasksAsync(string searchTerm, int page, int pageSize)
        {
            var query = _repository.GetQueryable();

            // Filter by title or description if search term is provided
            if (!string.IsNullOrWhiteSpace(searchTerm))
            {
                var lowerSearchTerm = searchTerm.ToLower();
                query = query.Where(t =>
                    t.Title.ToLower().Contains(lowerSearchTerm) ||
                    (t.Description != null && t.Description.ToLower().Contains(lowerSearchTerm))
                );
            }

            var allData = await query.ToListAsync();
            var totalCount = allData.Count;

            // Order by CreatedAt descending
            var tasks = allData
                .OrderByDescending(x => x.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToList();

            var taskDtos = tasks.Select(MapToDto);

            return new PaginatedTasksResultDto
            {
                Tasks = taskDtos,
                TotalCount = totalCount
            };
        }
    }
}
