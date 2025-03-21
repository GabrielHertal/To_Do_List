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

        public async Task<bool> ValidaUser(SecurityDTO loginDTO)
        {
            return await _context.Users.AnyAsync(u => u.Email == loginDTO.Email && u.Senha == loginDTO.Password);
        }

        public Task<SecurityDTO> RegisterAsync(SecurityDTO registerDTO)
        {
            throw new NotImplementedException();
        }
        public async Task<SecurityDTO?> GetUserInformation(string? email)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
            if (user == null)
            {
                return null;
            }
            return new SecurityDTO
            {
                Id = user.Id,
                Name = user.Nome,
                Email = user.Email,
                Password = user.Senha
            };
        }
    }
}