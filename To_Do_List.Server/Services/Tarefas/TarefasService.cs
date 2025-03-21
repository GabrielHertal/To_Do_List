using To_Do_List.Server.Models;
using To_Do_List.Server.Services;

namespace To_Do_List.Server
{
    public class TarefasService : ITarefasService
    {
        public Task<Tarefas> CreateAsync()
        {
            throw new NotImplementedException();
        }

        public Task<Tarefas> DeleteByIdAsync(int id)
        {
            throw new NotImplementedException();
        }

        public Task<Tarefas> GetTarefaByIdAsync(Guid id)
        {
            throw new NotImplementedException();
        }

        public Task<Tarefas> GetTarefasAsync()
        {
            throw new NotImplementedException();
        }

        public Task<Tarefas> UpdateByIdAsync(int id)
        {
            throw new NotImplementedException();
        }
    }
}
