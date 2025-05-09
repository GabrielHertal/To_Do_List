using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace To_Do_List.Server.Models
{
    public class Inter_Tarefa_Quadro
    {
        [Key]
        [Required]
        public int Id_Inter_Tarefa_Quadro { get; set; }
        [ForeignKey("Quadro")]
        [Required]
        public int Fk_Id_Quadro { get; set; }
        public Quadro Quadro { get; set; } = default!;
        [ForeignKey("Tarefas")]
        [Required]
        public int Fk_Id_Tarefa { get; set;}
        public Tarefas? Tarefas { get; set; }
    }
}