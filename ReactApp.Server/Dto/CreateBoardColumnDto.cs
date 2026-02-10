namespace ReactApp.Server.Dto
{
    public class CreateBoardColumnDto
    {
        public string Name { get; set; }
        public string StatusValue { get; set; }
        public int DisplayOrder { get; set; }
        public string Color { get; set; }
        public int? WipLimit { get; set; }
    }
}
