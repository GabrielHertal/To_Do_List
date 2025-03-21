using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace To_Do_List.Server.Models
{
    public class Users
    {
        [Key]
        public int Id { get; set; }
        [Required]
        [StringLength(50, ErrorMessage = "O nome de usuário deve conter o máximo 50 caracteres")]
        public required string Nome { get; set; }
        [Required]
        [StringLength(30, ErrorMessage = "A senha deve conter o máximo 30 caracteres")]
        public required string Senha { get; set; }
        [Required]
        [StringLength(50, ErrorMessage = "O email deve conter o máximo 50 caracteres")]
        public required string Email { get; set; }
        [Required]
        [Display(Name = "ATIVO - 1, INATIVO - 2")]
        [DefaultValue(1)]
        public required int Ativo { get; set; }
    }
}