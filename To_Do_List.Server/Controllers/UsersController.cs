using Microsoft.AspNetCore.Mvc;
using To_Do_List.Server.DTO;
using To_Do_List.Server.Models;

namespace To_Do_List.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IUsersService _user;

        public UsersController(IUsersService user)
        {
            _user = user;
        }
        [HttpPost("register")]
        public async Task<ActionResult> Register([FromBody] UserDTO userdto)
        {
            try
            {
                int result = await _user.CreateUserAsync(userdto.email, userdto.senha, userdto.nome);

                if (result == 201)
                {
                    return Ok(new { Message = "Usuário registrado com sucesso.", Status = "200" });
                }
                else if(result == 409)
                {
                    return Conflict(new { Message = "Usuário já existe.", Status = "409" });
                }
                else
                {
                    return BadRequest(new { Message = "Erro ao registrar usuário.", ErrorCode = result });
                }
            }
            catch (Exception e)
            {
                return BadRequest(new { Message = e.Message });
            }
        }
        [HttpGet("GetUsersId{id}")]
        public async Task<ActionResult> GetUserById(int id)
        {
            try
            {
                var user = await _user.GetUserByIdAsync(id);
                return Ok(user);
            }
            catch (Exception e)
            {
                return BadRequest(new { Message = e.Message });
            }
        }
        [HttpGet("GetAllUsers")]
        public async Task<ActionResult<List<Users>>> GetAllUsersAsync()
        {
            try
            {
                var users = await _user.GetAllUsersAsync();
                return Ok(users);
            }
            catch (Exception e)
            {
                return BadRequest(new { Message = e.Message });
            }
        }
        [HttpDelete("DeleteUser{id}")]
        public async Task<ActionResult> DeleteUser(int id)
        {
            try
            {
                var user = await _user.DeleteUserAsync(id);
                return Ok(new { Message = "Usuário deletado com sucesso.", Status = "200" });
            }
            catch (Exception e)
            {
                return BadRequest(new { Message = e.Message });
            }
        }
        [HttpPut("UpdateUser/{id}")]
        public async Task<ActionResult> UpdateUserByIdAsync(int id, [FromBody] UserUpdateDTO user)
        {
            try
            {
                int result = await _user.UpdateUserByIdAsync(id, user.Email, user.Senha, user.Nome);
                if (result == 200)
                {
                    return Ok(new { Message = "Usuário atualizado com sucesso.", Status = "200" });
                }
                else
                {
                    return BadRequest(new { Message = "Erro ao atualizar usuário.", ErrorCode = result });
                }
            }
            catch (Exception e)
            {
                return BadRequest(new { Message = "Erro aqui" + e.Message });
            }
        }
    }
}