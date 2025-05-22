using System.Security.Cryptography;
using Microsoft.EntityFrameworkCore;
using To_Do_List.Server.Data;
using To_Do_List.Server.DTO;
using To_Do_List.Server.Models;

namespace To_Do_List.Server.Services.Quadros
{
    public class QuadroService : IQuadroService
    {
        private readonly AppDbContext _context;
        public QuadroService(AppDbContext context)
        {
            _context = context;
        }
        public async Task<List<Quadro>> GetAllQuadrosAsync()
        {
            try
            {
                var quadro = await _context.Quadro
                                           .Where(q => q.Ativo == 1)
                                           .OrderBy(q => q.Id)
                                           .ToListAsync() ?? throw new Exception("Nenhum quadro encontrado");
                return quadro;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
        public async Task<Quadro> GetQuadroByIdAsync(int id)
        {
            try
            {
                var quadro = await _context.Quadro.FindAsync(id) ?? throw new Exception("Quadro não encontrado!");
                return quadro;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
        public async Task<List<Quadro>> GetQuadroByIdUserAsync(int id_user)
        {
            try
            {
                var quadros = await _context.Inter_Quadro_Users
                                             .Include(q => q.Quadro)
                                             .Where(q => q.Fk_Id_Users == id_user && q.Quadro != null && q.Quadro.Fk_Id_User_Dono != id_user)
                                             .Select(q => q.Quadro!)
                                             .ToListAsync() ?? throw new Exception("Quadro não encontrado!");
                return quadros;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
        public async Task<List<Quadro>> GetQuadrosTarefasByUserAsync(int id_user)
        {
            try
            {
                var quadros = await _context.Inter_Quadro_Users
                                             .Include(q => q.Quadro)
                                             .Where(q => q.Fk_Id_Users == id_user && q.Quadro != null)
                                             .Select(q => q.Quadro!)
                                             .ToListAsync() ?? throw new Exception("Quadro não encontrado!");
                return quadros;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
        public async Task<List<Quadro>> GetQuadroByOwnerId(int id_user_owner)
        {
            try
            {
                var quadros = await _context.Inter_Quadro_Users
                                            .Include(q => q.Quadro)
                                            .Where(q => q.Fk_Id_Users == id_user_owner && q.Quadro != null && q.Quadro.Fk_Id_User_Dono == id_user_owner)
                                            .Select(q => q.Quadro!)
                                            .ToListAsync() ?? throw new Exception("Quadro não encontrado!");
                return quadros;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
        public async Task<List<UsersVinculadosQuadroDTO>> GetMembrosByQuadroID(int id_quadro)
        {
            try
            {
                var membros = await _context.Inter_Quadro_Users
                                            .Include(q => q.Users)
                                            .Include(q => q.Quadro)
                                            .Where(q => q.Fk_Id_Quadro == id_quadro && q.Users != null)
                                            .Select(q => new UsersVinculadosQuadroDTO
                                            {
                                                id_user = q.Users!.Id,
                                                nome_user = q.Users.Nome,
                                                id_owner = q.Quadro!.Fk_Id_User_Dono,
                                                id_quadro = q.Quadro.Id
                                            })
                                            .ToListAsync() ?? throw new Exception("Quadro não encontrado!");
                return membros;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
        public async Task<int> CreateQuadroAsync(string nome, int id_user)
        {
            if (await QuadroExists(nome))
            {
                return 409;
            }
            try
            {
                var quadro = new Quadro
                {
                    Nome = nome,
                    Ativo = 1,
                    Fk_Id_User_Dono = id_user,
                    Codigo_Convite = null
                };

                await _context.Quadro.AddAsync(quadro);
                await _context.SaveChangesAsync();

                var inter_quadro = new Inter_Quadro_Users
                {
                    Fk_Id_Quadro = quadro.Id,
                    Fk_Id_Users = id_user
                };

                await _context.Inter_Quadro_Users.AddAsync(inter_quadro);
                await _context.SaveChangesAsync();
                return 201;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
        public async Task<int> DeleteQuadroAsync(int id)
        {
            try
            {
                if (await QuadroTarefa(id))
                {
                    return 409;
                }
                var quadro = await _context.Quadro.FindAsync(id);
                _context.Quadro.Remove(quadro!);
                await _context.SaveChangesAsync();
                return 200;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
        public async Task<int> UpdateQuadroAsync(int id, string nome)
        {
            try
            {
                var quadro = await _context.Quadro.FindAsync(id) ?? throw new Exception("Quadro não encontrado!");
                quadro.Nome = nome;
                _context.Quadro.Update(quadro);
                await _context.SaveChangesAsync();
                return 200;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
        public async Task<int> VinculaQuadroUserAsync(string convite, int id_user)
        {
            try
            {
                var quadro = await _context.Quadro.FirstOrDefaultAsync(q => q.Codigo_Convite == convite);
                var inter_quadro = new Inter_Quadro_Users
                {
                    Fk_Id_Quadro = quadro!.Id,
                    Fk_Id_Users = id_user
                };
                await _context.Inter_Quadro_Users.AddAsync(inter_quadro);
                await _context.SaveChangesAsync();
                return 201;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
        public async Task<int> VinculaCodigoConviteQuadro(int id_quadro, string codigo)
        {
            try
            {
                var quadro = await _context.Quadro.FindAsync(id_quadro) ?? throw new Exception("Quadro não encontrado!");
                quadro.Codigo_Convite = codigo;
                _context.Quadro.Update(quadro);
                await _context.SaveChangesAsync();
                return 200;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
        #region Função para criar o código convite
        public Task<string> CreateCodigoConvite(int tamanho)
        {
            const string caracteres = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            char[] resultado = new char[tamanho];
            byte[] bytesAleatorios = new byte[tamanho];
            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(bytesAleatorios);
            }

            for (int i = 0; i < tamanho; i++)
            {
                resultado[i] = caracteres[bytesAleatorios[i] % caracteres.Length];
            }

            return Task.FromResult(new string(resultado));
        }
        #endregion
        public async Task<int> VincularUserQuadroAsync(string convite, int id_user)
        {
            try
            {
                var quadro = await _context.Quadro.FirstOrDefaultAsync(q => q.Codigo_Convite == convite)
                             ?? throw new Exception("404: Quasro não encontrado!");
                int count = await _context.Inter_Quadro_Users
                                          .CountAsync(i => i.Fk_Id_Users == id_user && i.Quadro!.Id == quadro!.Id);
                if (count > 0)
                {
                    return 409;
                }
                var inter_quadro = new Inter_Quadro_Users
                {
                    Fk_Id_Quadro = quadro.Id,
                    Fk_Id_Users = id_user
                };
                await _context.Inter_Quadro_Users.AddAsync(inter_quadro);
                await _context.SaveChangesAsync();
                return 201;
            }
            catch (Exception ex)
            {
                if (ex.Message.StartsWith("404:"))
                {
                    throw new Exception("Erro 404: " + ex.Message.Substring(5));
                }
                throw new Exception("Erro 500: " + ex.Message);
            }
        }
        public async Task<int> DesvincularUserQuadroAsync(int id_quadro, int id_user)
        {
            try
            {
                var inter_quadro = await _context.Inter_Quadro_Users
                                                 .FirstOrDefaultAsync(i => i.Fk_Id_Quadro == id_quadro && i.Fk_Id_Users == id_user) ?? throw new Exception("Quadro não encontrado!");
                _context.Inter_Quadro_Users.Remove(inter_quadro);
                await _context.SaveChangesAsync();
                return 200;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
        private async Task<bool> QuadroExists(string nome)
        {
            return await _context.Quadro.AnyAsync(e => e.Nome == nome);
        }
        private async Task<bool> QuadroTarefa(int id)
        {
            return await _context.Inter_Tarefa_Quadro.AnyAsync(e => e.Fk_Id_Quadro == id);
        }
    }
}