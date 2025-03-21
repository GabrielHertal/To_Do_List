using To_Do_List.Server.Models;

namespace To_Do_List.Server
{
    public interface IUsersService
    {
        Task<Users> GetUserByNameAsync(string username);
        Task<Users> GetUserByIdAsync(int id);
        Task<int> CreateUserAsync(string email, string senha, string nome);
        Task<Users> UpdateUserAsync(Users user);
        Task<Users> DeleteUserAsync(int id);
        Task<List<Users>> GetAllUsersAsync();
    }
}