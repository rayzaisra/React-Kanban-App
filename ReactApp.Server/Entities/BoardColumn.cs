namespace ReactApp.Server.Entities
{
    public class BoardColumn
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string StatusValue { get; set; } // Maps to Task.Status enum values
        public int DisplayOrder { get; set; }
        public string Color { get; set; }
        public int? WipLimit { get; set; } // Work In Progress limit
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}
