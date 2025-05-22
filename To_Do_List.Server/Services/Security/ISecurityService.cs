using To_Do_List.Server.DTO;

namespace To_Do_List.Server.Services.Security
{
    public interface ISecurityService
    {
        Task<bool> ValidaUser(LoginDTO loginDTO);
        Task<SecurityDTO> GetUserInformationById(int? id);
        Task<SecurityDTO> GetUserInformationByEmail(string email);
    }
}