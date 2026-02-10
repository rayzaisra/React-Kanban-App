namespace ReactApp.Server.Entities
{
    public class UserPreferences
    {
        public Guid Id { get; set; }
        public string UserId { get; set; }
        public string PreferredView { get; set; } // "kanban", "list", "calendar", "timeline", "table"
        public string BoardSettings { get; set; } // JSON string for board customization
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}
