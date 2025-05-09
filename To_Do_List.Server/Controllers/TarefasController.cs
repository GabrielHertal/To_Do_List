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

        [HttpGet("GetTarefasByQuadro/{id}")]
        public async Task<ActionResult<List<Tarefas>>> GetTarefasByQuadro(int id)
        {
            try
            {
                var tarefas = await _tarefa.GetTarefasByQuadroAsync(id);
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
                int result = await _tarefa.CreateTarefaAsync(tarefaDTO.titulo, tarefaDTO.descricao, tarefaDTO.fkidusuario, tarefaDTO.status, DateTime.UtcNow, tarefaDTO.nota, tarefaDTO.fk_id_quadro);
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
        [HttpGet("GetTarefaByIDAsync/{id}")]
        public async Task<ActionResult> GetTarefaById(int id)
        {
            try
            {
                var tarefa = await _tarefa.GetTarefaByIdAsync(id);
                return Ok(tarefa);
            }
            catch (Exception e)
            {
                return BadRequest(new { Message = e.Message });
            }
        }
        [HttpPut("UpdateTarefa/{id}")]
        public async Task<ActionResult> UpdateTarefaByIdAsync(int id, [FromBody] tarefaDTO tarefa)
        {
            try
            {
                int result = await _tarefa.UpdateTarefaByIdAsync(id, tarefa.titulo, tarefa.descricao, tarefa.fkidusuario, tarefa.status, tarefa.nota);
                if (result == 200)
                {
                    return Ok(new { Message = "Tarefa atualizada com sucesso!", Status = "200" });
                }
                else
                {
                    return StatusCode(500, new { Message = "Erro ao atualizar a tarefa!", ErrorCode = result });
                }
            }
            catch (Exception e)
            {
                return BadRequest(new { Message = "Erro: " + e.Message });
            }
        }
        [HttpPut("UpdateStatusTarefa/{id}")]
        public async Task<ActionResult> UpdateStatusTarefaAsync(int id, [FromBody] UpdataStatusDTO statusdto)
        {
            try
            {
                int result = await _tarefa.UpdateStatusTarefaAsync(id, statusdto.Status);
                if(result == 200)
                {
                    return Ok(new { Message = "Status da tarefa atualizado com sucesso!", Status = "200" });
                }
                else
                {
                    return StatusCode(500, new { Message = "Erro ao atualizar Status da Tarefa " + id, ErrorCode = result });
                }
            }
            catch(Exception e)
            {
                return BadRequest(new { Message = "Erro " + e.Message });
            }
        }
        [HttpDelete("DeleteTarefa/{id}")]
        public async Task<ActionResult> DeleteByIdAsync(int id)
        {
            try
            {
                int result = await _tarefa.DeleteByIdAsync(id);
                if (result == 201)
                {
                    return Ok(new { Message = "Tarefa deletada com sucesso!", Status = "200" });
                }
                else
                {
                    return StatusCode(500, new { Message = "Erro ao deletar a tarefa!", ErrorCode = result });
                }
            }
            catch (Exception e)
            {
                return BadRequest(new { Message = "Erro: " + e.Message });
            }
        }
        [HttpPut("AlteraTarefaQuadro/{id_tarefa}/{id_quadro_novo}")]
        public async Task<ActionResult> AlteraTarefaQuadro(int id_tarefa, int id_quadro_novo)
        {
            try
            {
                int result = await _tarefa.AlteraTarefaQuadro(id_tarefa, id_quadro_novo);
                if (result == 200)
                {
                    return Ok(new { Message = "Tarefa alterada com sucesso!", Status = "200" });
                }
                else
                {
                    return StatusCode(500, new { Message = "Erro ao alterar a tarefa!", ErrorCode = result });
                }
            }
            catch (Exception e)
            {
                return BadRequest(new { Message = "Erro: " + e.Message });
            }
        }
    }
}