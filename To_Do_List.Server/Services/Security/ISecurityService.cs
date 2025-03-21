using To_Do_List.Server.DTO;

namespace To_Do_List.Server.Services.Security
{
    public interface ISecurityService
    {
        Task<bool> ValidaUser(SecurityDTO loginDTO);
        Task<SecurityDTO> RegisterAsync(SecurityDTO registerDTO);
        Task<SecurityDTO?> GetUserInformation(string? email);
    }
}