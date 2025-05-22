namespace To_Do_List.Server.DTO
{
    public class SecurityDTO
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public required string Email { get; set; }
        public string? Password { get; set; }
        public string? TokenJWT { get; set; }
    }
}