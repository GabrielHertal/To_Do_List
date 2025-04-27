using Microsoft.AspNetCore.Mvc;
using To_Do_List.Server.DTO;
using To_Do_List.Server.Models;
using To_Do_List.Server.Services.Quadros;

namespace To_Do_List.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class QuadroController : ControllerBase
    {
        private readonly IQuadroService _quadro;
        public QuadroController(IQuadroService quadro)
        {
            _quadro = quadro;
        }
        [HttpGet("GetAllQuadros")]
        public async Task<ActionResult<List<Quadro>>> GetAllQuadrosAsync()
        {
            try
            {
                var quadro = await _quadro.GetAllQuadrosAsync();
                return Ok(quadro);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [HttpPost("CreateQuadroAsync")]
        public async Task<ActionResult> CreateQuadro([FromBody] QuadroDTO quadrodto)
        {
            try
            {
                int result = await _quadro.CreateQuadroAsync(quadrodto.nome_quadro, quadrodto.id_user_owner);

                if (result == 201)
                {
                    return Ok(new { Message = "Quadro registrado com sucesso" });
                }
                else if (result == 409)
                {
                    return BadRequest(new { Message = "Quadro ja existente", Status = "409" });
                }
                else
                {
                    return BadRequest(new { Message = "Erro ao registrar quadro", Errorcode = result });
                }
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }
        [HttpGet("GetQuadroById{id}")]
        public async Task<ActionResult<Quadro>> GetQuadroByIdAsync(int id)
        {
            try
            {
                var quadro = await _quadro.GetQuadroByIdAsync(id);
                return Ok(quadro);
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }
        [HttpPost("CreateVinculoQuadroUser")]
        public async Task<ActionResult> VinculaQuadroUserAynsc(string convite, int id_user)
        {
            try
            {
                int result = await _quadro.VinculaQuadroUserAsync(convite, id_user);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }
        [HttpGet("GetQuadroByIdUser/{id_user}")]
        public async Task<ActionResult<Quadro>> GetQuadroByIdUserAsync(int id_user)
        {
            try
            {
                var quadro = await _quadro.GetQuadroByIdUserAsync(id_user);
                return Ok(quadro);
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }
        [HttpGet("GetQuadroByOwnerId/{id}")]
        public async Task<ActionResult<Quadro>> GetQuadroByOwnerId(int id)
        {
            try
            {
                var quadro = await _quadro.GetQuadroByOwnerId(id);
                return Ok(quadro);
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }
        [HttpPost("CreateCodigoConvite/{tamanho}")]
        public async Task<ActionResult<string>> CreateCodigoConvite(int tamanho)
        {
            try
            {
                var codigo = await _quadro.CreateCodigoConvite(tamanho);
                return Ok(codigo);
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }
        [HttpPut("VinculaCodigoConviteQuadro/{id}/{codigo}")]
        public async Task<ActionResult<int>> VinculaCodigoConviteQuadro(int id, string codigo)
        {
            try
            {
                var result = await _quadro.VinculaCodigoConviteQuadro(id, codigo);
                if (result == 404)
                {
                    return BadRequest(new { Message = "Quadro não encontrado", Status = "404" });
                }
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }
        [HttpGet("GetMembrosByQuadroID/{id_quadro}")]
        public async Task<ActionResult<List<UsersVinculadosQuadroDTO>>> GetMembrosByQuadroID(int id_quadro)
        {
            try
            {
                var membros = await _quadro.GetMembrosByQuadroID(id_quadro);
                return Ok(membros);
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }
        [HttpPost("VincularUserQuadroAsync/{convite}/{id_user}")]
        public async Task<ActionResult<int>> VincularUserQuadroAsync(string convite, int id_user)
        {
            try
            {
                var result = await _quadro.VincularUserQuadroAsync(convite, id_user);
                if (result == 404)
                {
                    return BadRequest(new { Message = "Quadro não encontrado", Status = "404" });
                }
                else if (result == 409)
                {
                    return BadRequest(new { Message = "Usuário já vinculado a este quadro!", Status = "409" });
                }
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }
        [HttpDelete("DesvincularUserQuadroAsync/{id_quadro}/{id_user}")]
        public async Task<ActionResult<int>> DesvincularUserQuadroAsync(int id_quadro, int id_user)
        {
            try
            {
                var result = await _quadro.DesvincularUserQuadroAsync(id_quadro, id_user);
                if (result == 404)
                {
                    return BadRequest(new { Message = "Quadro não encontrado", Status = "404" });
                }
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }
        [HttpPut("UpdateQuadroAsync/{id}/{nome}")]
        public async Task<ActionResult<int>> UpdateQuadroAsync(int id, string nome)
        {
            try
            {
                var result = await _quadro.UpdateQuadroAsync(id, nome);
                if (result == 404)
                {
                    return BadRequest(new { Message = "Quadro não encontrado", Status = "404" });
                }
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }
        [HttpDelete("DeleteQuadroAsync/{id}")]
        public async Task<ActionResult<int>> DeleteQuadroAsync(int id)
        {
            try
            {
                var result = await _quadro.DeleteQuadroAsync(id);
                if (result == 404)
                {
                    return BadRequest(new { Message = "Quadro não encontrado", Status = "404" });
                }
                if (result == 409)
                {
                    return BadRequest(new { Message = "Quadro não pode ser excluído, pois possui tarefas vinculadas!", Status = "409" });
                }
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }
    }
}