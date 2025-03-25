using Microsoft.AspNetCore.Mvc;
using To_Do_List.Server.DTO;
using To_Do_List.Server.Models;
using To_Do_List.Server.Services;

namespace To_Do_List.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TarefasController : ControllerBase
    {
        private readonly ITarefasService _tarefa;

        public TarefasController(ITarefasService tarefa)
        {
            _tarefa = tarefa;
        }

        [HttpGet("GetTarefasByUser/{id}")]
        public async Task<ActionResult<List<Tarefas>>> GetTarefasByUser(int id)
        {
            try
            {
                var tarefas = await _tarefa.GetTarefasByUserAsync(id);
                return Ok(tarefas);
            }
            catch (Exception e)
            {
                return BadRequest(new { Message = e.Message });
            }
        }
        [HttpPost("CreateTarefaAsync")]
        public async Task<ActionResult> CreateTarefaAsync([FromBody] tarefaDTO tarefaDTO)
        {
            try
            {
                int result = await _tarefa.CreateTarefaAsync(tarefaDTO.titulo, tarefaDTO.descricao, tarefaDTO.fkidusuario, tarefaDTO.status, DateTime.UtcNow);
                if (result == 201)
                {
                    return Ok(new { Message = "Tarefa criada com sucesso!", Status = 201 });
                }
                else if (result == 409)
                {
                    return Conflict(new { Message = "Tarefa já existente(títulos iguais)!", Status = 409 });
                }
                else
                {
                    return StatusCode(500, new { Message = "Erro ao criar a tarefa." });
                }
            }
            catch (Exception e)
            {
                return BadRequest($"Falha ao criar {e.Message}");
            }
        }
    }
}