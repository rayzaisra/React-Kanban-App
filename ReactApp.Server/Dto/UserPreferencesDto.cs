namespace ReactApp.Server.Dto
{
    public class UserPreferencesDto
    {
        public Guid Id { get; set; }
        public string UserId { get; set; }
        public string PreferredView { get; set; }
        public object BoardSettings { get; set; }
    }
}
