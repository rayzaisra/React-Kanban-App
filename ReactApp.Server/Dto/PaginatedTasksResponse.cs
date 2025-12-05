namespace ReactApp.Server.Dto
{
    public class PaginatedTasksResponse
    {
        public IEnumerable<TaskDto> Tasks { get; set; } = Enumerable.Empty<TaskDto>();
        public bool HasMore { get; set; }
        public int CurrentPage { get; set; }
        public int PageSize { get; set; }
        public int TotalCount { get; set; }
    }
}
