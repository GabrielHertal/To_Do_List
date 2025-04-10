using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace To_Do_List.Server.Models
{
    public class Inter_Quadro_Users
    {
        [ForeignKey("Users")]
        [Required]
        public int Fk_Id_Users { get; set; }
        public Users? Users { get; set; }
        [ForeignKey("Quadro")]
        [Required]
        public int Fk_Id_Quadro { get; set; }
        public Quadro? Quadro { get; set; } 
    }
}