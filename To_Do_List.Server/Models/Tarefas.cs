﻿using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace To_Do_List.Server.Models
{
    public class Tarefas
    {
        [Key]
        public int Id { get; set; }
        [Required]
        [StringLength(30, ErrorMessage = "O título da tarefa deve conter o máximo 30 caracteres")]
        public required string Titulo { get; set; }
        public string? Descricao { get; set; }
        [Required]
        public DateTime DataCriacao { get; set; }
        [Required]
        public DateTime? DataConclusao { get; set; }
        [Required]
        [Display(Name = "A FAZER - 0, FAZENDO - 1, CONCLUIDA - 2")]
        public bool Status { get; set; }
        [ForeignKey("Users")]
        public int FkIdUsuario { get; set; }
        public Users? Users { get; set; }
    }
}
