using Microsoft.EntityFrameworkCore;
using Npgsql;
using To_Do_List.Server.Data;
using To_Do_List.Server.Models;

namespace To_Do_List.Server
{
    public class UsersService : IUsersService
    {
        private readonly AppDbContext _context;
        public UsersService(AppDbContext context)
        {
            _context = context;
        }
        public async Task<int> CreateUserAsync(string email, string senha, string nome)
        {
            if (await UserExists(email))
            {
                return 409;
            }
            try
            {
                var user = new Users
                {
                    Email = email,
                    Senha = senha,
                    Nome = nome,
                    Ativo= 1
                };
                await _context.Users.AddAsync(user);
                await _context.SaveChangesAsync();
                return 201; 
            }
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }
        }

        public async Task<Users> DeleteUserAsync(int id)
        {
            try
            {
                var user = await _context.Users.FindAsync(id);
                if (user == null)
                {
                    throw new Exception("Usuário não encontrado.");
                }
                user.Ativo = 2;
                _context.Users.Update(user);
                await _context.SaveChangesAsync();
                return user;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }
        }

        public async Task<Users> GetUserByIdAsync(int id)
        {
            try
            {
                var user = await _context.Users.FindAsync(id);
                if (user == null)
                {
                    throw new Exception("Usuário não encontrado.");
                }
                return user;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }
        }

        public Task<Users> GetUserByNameAsync(string username)
        {
            throw new NotImplementedException();
        }

        public Task<Users> UpdateUserAsync(Users user)
        {
            throw new NotImplementedException();
        }
        public async Task<List<Users>> GetAllUsersAsync()
        {
            try
            {
                var users = await _context.Users
                                          .Where(u => u.Ativo == 1)
                                          .OrderBy(u => u.Id) 
                                          .ToListAsync();
                if (users == null || users.Count == 0)
                {
                    throw new Exception("Nenhum usuário encontrado.");
                }
                return users;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }
        }
        private async Task<bool> UserExists(string email)
        {
            return await _context.Users.AnyAsync(e => e.Email == email);
        }
    }
}