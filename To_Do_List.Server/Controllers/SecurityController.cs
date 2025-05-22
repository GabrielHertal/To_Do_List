using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using To_Do_List.Server.DTO;
using To_Do_List.Server.Services.Security;

namespace To_Do_List.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SecurityController : ControllerBase
    {
        private IConfiguration _config;
        private readonly ISecurityService _security;

        public SecurityController(ISecurityService security, IConfiguration config)
        {
            _security = security;
            _config = config;
        }

        [HttpPost("Login")]
        public async Task<IActionResult> Login([FromBody] LoginDTO loginDTO)
        {
            bool result = await _security.ValidaUser(loginDTO);
            if (result)
            {
                var token = await GerateTokenJWT(loginDTO);
                var userInformation = await _security.GetUserInformationByEmail(loginDTO.Email) ?? throw new InvalidOperationException("Variavel USERINFORMATION == null");
                return Ok(new { token, userInformation.Id, userInformation.Name });
            }
            else
            {
                return Unauthorized();
            }
        }
        [HttpGet("GetUserInformation")]
        public async Task<SecurityDTO?> GetUserInformationClaims()
        {
            var authToken = Request.Headers["Authorization"].FirstOrDefault();
            if (string.IsNullOrEmpty(authToken) || !authToken.StartsWith("Bearer "))
            {
                return null;
            }
            var token = authToken.Substring("Bearer ".Length).Trim();
            var claims = GetClaims(token);
            if (claims.TryGetValue(ClaimTypes.NameIdentifier, out string? id))
            {
                return await _security.GetUserInformationById(Convert.ToInt16(id));
            }
            return null;
        }

        private static Dictionary<string, string> GetClaims(string authToken)
        {
            var handler = new JwtSecurityTokenHandler();
            var jsonToken = handler.ReadToken(authToken) as JwtSecurityToken;
            var claims = jsonToken?.Claims.ToDictionary(claim => claim.Type, claim => claim.Value);
            if (claims != null)
            {
                return claims;
            }
            else
            {
                Console.WriteLine("Variavel CLAIMS == null");
                throw new InvalidOperationException("Variavel CLAIMS == null");
            }
        }

        private async Task<string> GerateTokenJWT(LoginDTO loginDTO)
        {
            try
            {
                var userinformation = await _security.GetUserInformationByEmail(loginDTO.Email) ?? throw new InvalidOperationException("Variavel USERINFORMATION == null");
                var claims = new[]
                {
                new Claim(ClaimTypes.Email, userinformation.Email),
                new Claim(ClaimTypes.NameIdentifier, Convert.ToString(userinformation.Id)!)
                };

                var issuer = _config["Jwt:Issuer"];
                var audience = _config["Jwt:Audience"];
                var expiry = DateTime.Now.AddMinutes(Convert.ToDouble(_config["Jwt:ExpiresInMinutes"]));
                var securitykey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
                var credentials = new SigningCredentials(securitykey, SecurityAlgorithms.HmacSha256);
                var token = new JwtSecurityToken(issuer, audience, claims, expires: expiry, signingCredentials: credentials);
                var tokenHandler = new JwtSecurityTokenHandler();
                var stringToken = tokenHandler.WriteToken(token);
                return stringToken;
            }
            catch (Exception ex)
            {
                Console.WriteLine("Erro: " +  ex.Message);
                return "vazio";
            }
        }
    }
}