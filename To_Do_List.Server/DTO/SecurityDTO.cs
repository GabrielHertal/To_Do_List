namespace To_Do_List.Server.DTO
{
    public class SecurityDTO
    {
        public int Id { get; set; } = default!;
        public string? Name { get; set; }
        public required string Email { get; set; } = default!;
        public required string Password { get; set; }
        public string? TokenJWT { get; set; }
    }
}
