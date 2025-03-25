using Microsoft.EntityFrameworkCore;
using To_Do_List.Server.Data;
using To_Do_List.Server.Models;
using To_Do_List.Server.Services;

namespace To_Do_List.Server
{
    public class TarefasService : ITarefasService
    {
        private readonly AppDbContext _context;
        public TarefasService(AppDbContext context)
        {
            _context = context;
        }
        public async Task<int> CreateTarefaAsync(string titulo, string descricao, int id_user, char status, DateTime data_criacao)
        {
            try
            {
                if (await TarefaExists(titulo))
                {
                    return 409;
                }
                var tarefa = new Tarefas
                {
                    Titulo = titulo,
                    Descricao = descricao,
                    DataCriacao = data_criacao,
                    Status = status,
                    FkIdUsuario = id_user
                };
                Console.WriteLine(tarefa);
                await _context.Tarefas.AddAsync(tarefa);
                await _context.SaveChangesAsync();
                return 201;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message); 
            }
        }

        public Task<Tarefas> DeleteByIdAsync(int id)
        {
            throw new NotImplementedException();
        }

        public Task<int> GetTarefaByIdAsync(int id)
        {
            throw new NotImplementedException();
        }

        public async Task<List<Tarefas>> GetTarefasByUserAsync(int id_user)
        {
            try
            {
                var tarefas = await _context.Tarefas.Where(t => t.FkIdUsuario == id_user)
                                                    .ToListAsync();
                return tarefas;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }
        }
        public Task<Tarefas> UpdateByIdAsync(int id)
        {
            throw new NotImplementedException();
        }
        private async Task<bool> TarefaExists(string titulo)
        {
            return await _context.Tarefas.AnyAsync(t => t.Titulo == titulo);
        }
    }
}
