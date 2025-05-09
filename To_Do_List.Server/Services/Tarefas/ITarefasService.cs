using To_Do_List.Server.Models;

namespace To_Do_List.Server.Services
{
    public interface ITarefasService
    {
        Task<List<Tarefas>> GetTarefasByQuadroAsync(int id_quadro);
        Task<Tarefas> GetTarefaByIdAsync(int id);
        Task<int> CreateTarefaAsync(string titulo, string descricao, int id_user, char status, DateTime data_criacao, string nota, int fk_id_quadro);
        Task<int> UpdateTarefaByIdAsync(int id, string titulo, string descricao, int id_user, char status, string nota);
        Task<int> DeleteByIdAsync(int id);
        Task<int> UpdateStatusTarefaAsync(int id_tarefa, char status);
        Task<int> AlteraTarefaQuadro(int id_tarefa, int id_quadro_novo);
    }
}