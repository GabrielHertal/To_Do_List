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
                                           .ToListAsync();
                if (quadro == null || quadro.Count == 0)
                {
                    throw new Exception("Nenhum quadro encontrado");
                }
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
                var quadro = await _context.Quadro.FindAsync(id);
                if (quadro == null)
                {
                    throw new Exception("Quadro não encontrado!");
                }
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
                                             .ToListAsync();
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
                                            .ToListAsync();
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
                                                id_owner = q.Quadro!.Fk_Id_User_Dono
                                            })
                                            .ToListAsync();
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
                await _context.SaveChangesAsync(); // Aqui o ID será gerado

                var inter_quadro = new Inter_Quadro_Users
                {
                    Fk_Id_Quadro = quadro.Id, // Agora o Id está preenchido
                    Fk_Id_Users = id_user
                };

                await _context.Inter_Quadro_Users.AddAsync(inter_quadro);
                await _context.SaveChangesAsync();

                return 201; // Criado com sucesso
            }

            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public Task<Quadro> DeleteQuadroAsync(int id)
        {
            throw new NotImplementedException();
        }

        public async Task<int> UpdateQuadroAsync(int id, string nome)
        {
            try
            {
                var quadro = await _context.Quadro.FindAsync(id);
                if (quadro == null)
                {
                    return 404;
                }
                quadro.Nome = nome;
                _context.Quadro.Update(quadro);
                await _context.SaveChangesAsync();
                return 200;
            }
            catch(Exception ex)
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
                var quadro = await _context.Quadro.FindAsync(id_quadro);
                if (quadro == null)
                {
                    return 404;
                }
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
        public async Task<int> VincularUserQuadroAsync(string convite, int id_user)
        {
            try
            {
                var quadro = await _context.Quadro.FirstOrDefaultAsync(q => q.Codigo_Convite == convite);
                if (quadro == null)
                {
                    return 404;
                }
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
                throw new Exception(ex.Message);
            }
        }
        public async Task<int> DesvincularUserQuadroAsync(int id_quadro, int id_user)
        {
            try
            {
                var inter_quadro = await _context.Inter_Quadro_Users
                                                 .FirstOrDefaultAsync(i => i.Fk_Id_Quadro == id_quadro && i.Fk_Id_Users == id_user);
                if (inter_quadro == null)
                {
                    return 404;
                }
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
    }
}