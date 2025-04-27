namespace To_Do_List.Server.DTO
{
    public class UsersVinculadosQuadroDTO
    {
        public int id_user { get; set; }
        public string? nome_user { get; set; }
        public int id_owner { get; set; } = default!;
        public int id_quadro { get; set; }
    }
}