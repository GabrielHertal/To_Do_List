using To_Do_List.Server.Models;

namespace To_Do_List.Server.Services
{
    public interface ITarefasService
    {
        Task<List<Tarefas>> GetTarefasByUserAsync(int id_user);
        Task<int> GetTarefaByIdAsync(int id);
        Task<int> CreateTarefaAsync(string titulo, string descricao, int id_user, char status, DateTime data_criacao);
        Task<Tarefas> UpdateByIdAsync(int id);
        Task<Tarefas> DeleteByIdAsync(int id);
    }
}
