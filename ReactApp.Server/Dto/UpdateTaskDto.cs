using ReactApp.Server.Entities;

namespace ReactApp.Server.Dto
{
    public class UpdateTaskDto
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public string RequestedBy { get; set; }
        public string RequestDate { get; set; }
        public string DueDate { get; set; }
        public string Status { get; set; }
        public bool IsCompleted { get; set; }
        public string TaskType { get; set; }
    }
}
