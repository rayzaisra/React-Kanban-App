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

            var validTaskTypes = new[] { "Enhance", "BugFixing", "DailyRoutine" };
            var taskType = validTaskTypes.Contains(dto.TaskType) ? dto.TaskType : "Enhance";

            var priority = (Priority)Math.Clamp(dto.Priority.Value, 0, 3);

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
                TaskType = taskType,
                Priority = priority
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

            if (!string.IsNullOrEmpty(dto.TaskType))
            {
                var validTaskTypes = new[] { "Enhance", "BugFixing", "DailyRoutine" };
                if (validTaskTypes.Contains(dto.TaskType))
                {
                    task.TaskType = dto.TaskType;
                }
            }

            // Update Priority
            task.Priority = (Priority)Math.Clamp(dto.Priority, 0, 3);

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
                Status = (int)task.Status,
                IsCompleted = task.IsCompleted,
                CreatedAt = task.CreatedAt,
                UpdatedAt = task.UpdatedAt,
                TaskType = task.TaskType ?? "Enhance",
                Priority = (int)task.Priority
            };
        }

        public async Task<PaginatedTasksResultDto> GetPaginatedWithCountAsync(
    int page,
    int pageSize,
    string sortBy = "createdAt",
    string sortOrder = "desc")
        {
            var baseQuery = _repository.GetQueryable();

            // Total count of ALL tasks (not per page)
            var totalCount = await baseQuery.CountAsync();

            // Build ordered query function
            IQueryable<Entities.Task> ApplySorting(IQueryable<Entities.Task> q) =>
                sortBy.ToLower() switch
                {
                    "priority" => sortOrder == "asc"
                        ? q.OrderBy(x => x.Priority)
                        : q.OrderByDescending(x => x.Priority),

                    "duedate" => sortOrder == "asc"
                        ? q.OrderBy(x => x.DueDate ?? DateTime.MaxValue)
                        : q.OrderByDescending(x => x.DueDate ?? DateTime.MinValue),

                    "title" => sortOrder == "asc"
                        ? q.OrderBy(x => x.Title)
                        : q.OrderByDescending(x => x.Title),

                    _ => sortOrder == "asc"
                        ? q.OrderBy(x => x.CreatedAt)
                        : q.OrderByDescending(x => x.CreatedAt)
                };

            var skip = (page - 1) * pageSize;

            // Query per status
            var doneTasks = await ApplySorting(baseQuery.Where(x => x.Status == Status.Done))
                .Skip(skip)
                .Take(pageSize)
                .ToListAsync();

            var inProgressTasks = await ApplySorting(baseQuery.Where(x => x.Status == Status.InProgress))
                .Skip(skip)
                .Take(pageSize)
                .ToListAsync();

            var todoTasks = await ApplySorting(baseQuery.Where(x => x.Status == Status.ToDo))
                .Skip(skip)
                .Take(pageSize)
                .ToListAsync();

            // Merge all groups
            var combined = doneTasks
                .Concat(inProgressTasks)
                .Concat(todoTasks)
                .ToList();

            var taskDtos = combined.Select(MapToDto);

            return new PaginatedTasksResultDto
            {
                Tasks = taskDtos,
                TotalCount = totalCount
            };
        }

        public async Task<PaginatedTasksResultDto> SearchTasksAsync(
            string searchTerm,
            int page,
            int pageSize,
            string taskType = "",
            string status = "",
            int? priority = null,
            bool? overdue = null)
        {
            var query = _repository.GetQueryable();

            // Search filter
            if (!string.IsNullOrWhiteSpace(searchTerm))
            {
                var lowerSearchTerm = searchTerm.ToLower();
                query = query.Where(t =>
                    t.Title.ToLower().Contains(lowerSearchTerm) ||
                    (t.Description != null && t.Description.ToLower().Contains(lowerSearchTerm))
                );
            }

            // TaskType filter
            if (!string.IsNullOrWhiteSpace(taskType))
            {
                query = query.Where(t => t.TaskType == taskType);
            }

            // Status filter
            if (!string.IsNullOrWhiteSpace(status))
            {
                var statusEnum = status switch
                {
                    "ToDo" => Status.ToDo,
                    "InProgress" => Status.InProgress,
                    "Done" => Status.Done,
                    _ => Status.ToDo
                };
                query = query.Where(t => t.Status == statusEnum);
            }

            // Priority filter
            if (priority.HasValue)
            {
                var priorityEnum = (Priority)Math.Clamp(priority.Value, 0, 3);
                query = query.Where(t => t.Priority == priorityEnum);
            }

            // Overdue filter
            if (overdue.HasValue && overdue.Value)
            {
                var now = DateTime.Now;
                query = query.Where(t => t.DueDate.HasValue && t.DueDate.Value < now && !t.IsCompleted);
            }

            var allData = await query.ToListAsync();
            var totalCount = allData.Count;

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

        // Analytics methods
        public async Task<object> GetAnalyticsSummaryAsync()
        {
            var tasks = await _repository.GetAllAsync();
            var now = DateTime.Now;

            return new
            {
                totalTasks = tasks.Count(),
                completedTasks = tasks.Count(t => t.IsCompleted),
                overdueTasks = tasks.Count(t => t.DueDate.HasValue && t.DueDate.Value < now && !t.IsCompleted),
                highPriorityTasks = tasks.Count(t => t.Priority == Priority.High || t.Priority == Priority.Critical),
                tasksByStatus = new
                {
                    toDo = tasks.Count(t => t.Status == Status.ToDo),
                    inProgress = tasks.Count(t => t.Status == Status.InProgress),
                    done = tasks.Count(t => t.Status == Status.Done)
                }
            };
        }

        public async Task<object> GetTasksByTypeAsync()
        {
            var tasks = await _repository.GetAllAsync();

            return new
            {
                enhance = tasks.Count(t => t.TaskType == "Enhance"),
                bugFixing = tasks.Count(t => t.TaskType == "BugFixing"),
                dailyRoutine = tasks.Count(t => t.TaskType == "DailyRoutine")
            };
        }

        public async Task<object> GetTasksByPriorityAsync()
        {
            var tasks = await _repository.GetAllAsync();

            return new
            {
                low = tasks.Count(t => t.Priority == Priority.Low),
                medium = tasks.Count(t => t.Priority == Priority.Medium),
                high = tasks.Count(t => t.Priority == Priority.High),
                critical = tasks.Count(t => t.Priority == Priority.Critical)
            };
        }
    }
}
