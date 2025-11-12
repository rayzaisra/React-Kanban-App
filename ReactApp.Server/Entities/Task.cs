using System.ComponentModel.DataAnnotations.Schema;

namespace ReactApp.Server.Entities
{
    public class Task
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string RequestedBy { get; set; }
        [Column(TypeName = "timestamp")]
        public DateTime RequestDate { get; set; }
        [Column(TypeName = "timestamp")]
        public DateTime? DueDate { get; set; }
        public Status Status { get; set; }
        public bool IsCompleted { get; set; }
        [Column(TypeName = "timestamp")]
        public DateTime CreatedAt { get; set; }
    }
}
