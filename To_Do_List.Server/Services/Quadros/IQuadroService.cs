using To_Do_List.Server.DTO;
using To_Do_List.Server.Models;

namespace To_Do_List.Server.Services.Quadros
{
    public interface IQuadroService
    {
        Task<int> CreateQuadroAsync(string nome, int id_user_owner);
        Task<int> UpdateQuadroAsync(int id , string nome);
        Task<Quadro> DeleteQuadroAsync(int id);
        Task <List<Quadro>> GetAllQuadrosAsync();
        Task <Quadro> GetQuadroByIdAsync(int id);
        Task<int> VinculaQuadroUserAsync(string convite, int id_user);
        Task <List<Quadro>> GetQuadroByIdUserAsync(int id_user);   
        Task <List<Quadro>> GetQuadroByOwnerId(int id_user_owner);
        Task<string> CreateCodigoConvite(int tamanho);
        Task<int> VinculaCodigoConviteQuadro(int id_quadro, string codigo);
        Task <List<UsersVinculadosQuadroDTO>> GetMembrosByQuadroID(int id_quadro);
        Task<int> VincularUserQuadroAsync(string convite, int id_user);
        Task<int> DesvincularUserQuadroAsync(int id_quadro, int id_user);
    }
}