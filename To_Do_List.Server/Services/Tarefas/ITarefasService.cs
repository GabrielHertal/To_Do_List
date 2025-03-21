using To_Do_List.Server.Models;

namespace To_Do_List.Server.Services
{
    public interface ITarefasService
    {
        Task<Tarefas> GetTarefasAsync();
        Task<Tarefas> GetTarefaByIdAsync(Guid id);
        Task<Tarefas> CreateAsync();
        Task<Tarefas> UpdateByIdAsync(int id);
        Task<Tarefas> DeleteByIdAsync(int id);
    }
}
