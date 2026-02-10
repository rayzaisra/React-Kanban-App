namespace ReactApp.Server.Dto
{
    public class UpdateBoardColumnDto
    {
        public string Name { get; set; }
        public int DisplayOrder { get; set; }
        public string Color { get; set; }
        public int? WipLimit { get; set; }
        public bool IsActive { get; set; }
    }
}
