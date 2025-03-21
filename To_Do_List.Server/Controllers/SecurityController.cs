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
        public async Task<IActionResult> Login([FromBody] SecurityDTO loginDTO)
        {
            bool result = await _security.ValidaUser(loginDTO);
            if (result)
            {
                var token = await GerateTokenJWT(loginDTO);
                return Ok(new { token});
            }
            else
            {
                return Unauthorized();
            }
        }
        [HttpGet("Validate-Token")]
        public IActionResult ValidateToken()
        {
            var authHeader = Request.Headers["AuthToken"].FirstOrDefault();
            if (string.IsNullOrEmpty(authHeader))
            {
                return Unauthorized(new { Message = "Token não encontrado" });
            }
            var token = authHeader.Split(" ")[0];
            var key = Encoding.UTF8.GetBytes(_config["Jwt:Key"] ?? throw new ArgumentNullException("Jwt:Key"));
            var tokenHandler = new JwtSecurityTokenHandler();
            try
            {
                tokenHandler.ValidateToken(token, new TokenValidationParameters
                {
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuerSigningKey = true,
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidIssuer = _config["Jwt:Issuer"],
                    ValidAudience = _config["Jwt:Audience"],
                    ValidateLifetime = true,
                    ClockSkew = TimeSpan.Zero
                }, out SecurityToken validatedToken);

                var jwtToken = validatedToken as JwtSecurityToken;
                var expiration = jwtToken?.ValidTo;
                return Ok(new { Message = "Token Válido", Expiration = expiration });
            }
            catch
            {
                return Unauthorized(new { Message = "Token inválido", StatusCode = 401 });
            }
        }
        [HttpGet("GetUserInformation")]
        public async Task<SecurityDTO?> GetUserInformation()
        {
            var authToken = Request.Headers["AuthToken"].FirstOrDefault();
            if (string.IsNullOrEmpty(authToken))
            {
                return null;
            }
            var Claims = GetClaims(authToken);
            if (Claims.TryGetValue(ClaimTypes.Email, out string? email))
            {
                return await _security.GetUserInformation(email);
            }
            return null;
        }
        private static Dictionary<string, string> GetClaims(string authToken)
        {
            var token = authToken.Split("")[0];
            var handler = new JwtSecurityTokenHandler();
            var jsonToken = handler.ReadToken(token) as JwtSecurityToken;
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
        private async Task<string> GerateTokenJWT(SecurityDTO loginDTO)
        {
            var userinformation = await _security.GetUserInformation(loginDTO.Email);
            if (userinformation == null)
            {
                Console.WriteLine("Variavel USERINFORMATION == null");
                throw new InvalidOperationException("Variavel USERINFORMATION == null");
            }
            var claims = new[]
            {
                new Claim(ClaimTypes.Email, userinformation.Email),
                new Claim(ClaimTypes.NameIdentifier, loginDTO.Id.ToString())
            };
            var issuer = _config["Jwt:Issuer"];
            var audience = _config["Jwt:Audience"];
            var expiry = DateTime.Now.AddMinutes(120);
            var securitykey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
            var credentials = new SigningCredentials(securitykey, SecurityAlgorithms.HmacSha256);
            var token = new JwtSecurityToken(issuer, audience, claims, expires: expiry, signingCredentials: credentials);
            var tokenHandler = new JwtSecurityTokenHandler();
            var stringToken = tokenHandler.WriteToken(token);
            return stringToken;
        }
    }
}