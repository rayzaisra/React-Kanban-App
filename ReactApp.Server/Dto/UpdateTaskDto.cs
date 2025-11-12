using ReactApp.Server.Entities;

namespace ReactApp.Server.Dto
{
    public class UpdateTaskDto
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public string RequestedBy { get; set; }
        public string? RequestDate { get; set; }   // ← STRING FROM REACT
        public string? DueDate { get; set; }       // ← STRING FROM REACT
        // ← ACCEPT STRING FROM REACT
        public string Status { get; set; }  // "ToDo", "InProgress", "Done"
        public bool IsCompleted { get; set; }
    }
}
