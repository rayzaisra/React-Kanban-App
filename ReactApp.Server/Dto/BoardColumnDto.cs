namespace ReactApp.Server.Dto
{
    public class BoardColumnDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string StatusValue { get; set; }
        public int DisplayOrder { get; set; }
        public string Color { get; set; }
        public int? WipLimit { get; set; }
        public bool IsActive { get; set; }
    }
}
