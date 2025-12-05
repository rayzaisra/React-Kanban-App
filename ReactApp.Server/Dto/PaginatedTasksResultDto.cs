namespace ReactApp.Server.Dto
{
    public class PaginatedTasksResultDto
    {
        public IEnumerable<TaskDto> Tasks { get; set; } = Enumerable.Empty<TaskDto>();
        public int TotalCount { get; set; }
    }
}
