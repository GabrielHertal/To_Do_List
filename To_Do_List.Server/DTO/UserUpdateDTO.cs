namespace To_Do_List.Server.DTO
{
    public class UserUpdateDTO
    {
        public string Email { get; set; } = default!;
        public string Senha { get; set; } = default!;
        public string Nome { get; set; } = default!;
    }
}
