﻿namespace To_Do_List.Server.DTO
{
    public class tarefaDTO
    {
        public string titulo { get; set; } = default!;
        public string descricao { get; set; } = default!;
        public DateTime? data_criacao { get; set; } 
        public int fkidusuario { get; set; }
        public char status { get; set; }
        public string nota { get; set; } = default!;
        public int fk_id_quadro { get; set; }
    }
}