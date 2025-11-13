namespace ReactApp.Server.Dto
{
    public class CreateTaskDto
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public string RequestedBy { get; set; }
        public string RequestDate { get; set; }
        public string? DueDate { get; set; }
    }
}
