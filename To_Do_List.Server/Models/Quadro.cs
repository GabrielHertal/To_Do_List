using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace To_Do_List.Server.Models
{
    public class Quadro
    {
        [Key]
        [Required]
        public int Id { get; set; }
        [Required]
        public required string Nome { get; set; }
        [ForeignKey("Users")]
        public int Fk_Id_User_Dono {  get; set; }
        public Users? Users { get; set; }
        public string? Codigo_Convite { get; set; }
        [Required]
        [DefaultValue(1)]
        public int Ativo { get; set; }
    }
}