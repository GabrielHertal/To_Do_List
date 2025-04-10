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
        public async Task<int> CreateTarefaAsync(string titulo, string descricao, int id_user, char status, DateTime data_criacao, string nota)
        {
            try
            {
                if (await TarefaExists(titulo, id_user))
                {
                    return 409;
                }
                var tarefa = new Tarefas
                {
                    Titulo = titulo,
                    Descricao = descricao,
                    DataCriacao = data_criacao,
                    Status = Convert.ToChar(status),
                    Nota = nota
                };
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

        public async Task<Tarefas> GetTarefaByIdAsync(int id)
        {
            try
            {
                var tarefas = await _context.Tarefas.FindAsync(id);
                if (tarefas == null)
                {
                    throw new Exception("Tarefa não encontrada!");
                }
                return tarefas;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<List<Tarefas>> GetTarefasByQuadroAsync(int id_quadro)
        {
            try
            {
                var tarefas = await _context.Inter_Tarefa_Quadro
                                            .Include(t => t.Tarefas)
                                            .Where(t => t.Fk_Id_Quadro == id_quadro)
                                            .Select(t => t.Tarefas!)
                                            .ToListAsync();
                return tarefas;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }
        }
        public async Task<int> UpdateTarefaByIdAsync(int id, string titulo, string descricao, int id_user, char status, string nota)
        {
            try
            {
                var tarefa = await _context.Tarefas.FindAsync(id);
                if(tarefa == null)
                {
                    throw new Exception("Tarefa não encontrada)");
                }

                tarefa.Titulo = titulo;
                tarefa.Descricao = descricao;
                tarefa.Status = status;
                tarefa.Nota = nota;

                _context.Tarefas.Update(tarefa);
                await _context.SaveChangesAsync();
                return 200;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }
        }
        public async Task<int> UpdateStatusTarefaAsync(int id, char status)
        {
            try
            {
                var tarefa = await _context.Tarefas.FindAsync(id);
                Console.WriteLine(tarefa);
                if (tarefa == null)
                {
                    throw new Exception("Tarefa não encontrada");
                }
                if(tarefa.Status == '2' & status == '1' | status != '0')
                {
                    tarefa.DataConclusao = null;
                }
                if (status == '2')
                {
                    tarefa.DataConclusao = DateTime.UtcNow.AddHours(-3);
                }

                tarefa.Status = Convert.ToChar(status);
                tarefa.Id = tarefa.Id;


                _context.Tarefas.Update(tarefa);
                await _context.SaveChangesAsync();
                return 200;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }
        }
        private async Task<bool> TarefaExists(string titulo, int id_user)
        {
            return await _context.Tarefas.AnyAsync(t => t.Titulo == titulo);
        }
    }
}