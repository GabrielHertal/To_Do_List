using Microsoft.EntityFrameworkCore;
using To_Do_List.Server.Data;
using To_Do_List.Server.DTO;

namespace To_Do_List.Server.Services.Security
{
    public class SecurityService : ISecurityService
    {
        private readonly AppDbContext _context;
        public SecurityService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<bool> ValidaUser(LoginDTO loginDTO)
        {
            try
            {
                return await _context.Users.AnyAsync(u => u.Email == loginDTO.Email && u.Senha == loginDTO.Password);
            }
            catch (Exception)
            {
                return false;
            }
        }
        public async Task<SecurityDTO> GetUserInformationById(int? id)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == id);
            return new SecurityDTO
            {
                Id = user!.Id,
                Name = user.Nome,
                Email = user.Email,
                Password = user.Senha
            };
        }
        public async Task<SecurityDTO> GetUserInformationByEmail(string email)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
            return new SecurityDTO
            {
                Id = user!.Id,
                Name = user.Nome,
                Email = user.Email,
                Password = user.Senha
            };
        }
    }
}