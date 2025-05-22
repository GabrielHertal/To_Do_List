using Microsoft.EntityFrameworkCore;
using To_Do_List.Server;
using To_Do_List.Server.Data;
using To_Do_List.Server.Extensoes;
using To_Do_List.Server.Services;
using To_Do_List.Server.Services.Quadros;
using To_Do_List.Server.Services.Security;

var builder = WebApplication.CreateBuilder(args);

// Configuração de serviços
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddOpenApi();
builder.Services.AddMvc();

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.ConfigureJWT(builder.Configuration);
builder.Services.ConfigureCors();
builder.Services.ConfigureIISIntegration();
builder.Services.AddAuthorization();

builder.Services.AddScoped<IUsersService, UsersService>();
builder.Services.AddScoped<ITarefasService, TarefasService>();
builder.Services.AddScoped<ISecurityService, SecurityService>();
builder.Services.AddScoped<IQuadroService, QuadroService>();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHsts();
app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseDefaultFiles();

app.UseRouting();
app.UseCors(ServicesExtensions.MyAllowSpecificOrigins);

app.UseAuthentication();
app.UseAuthorization();

app.UseEndpoints(endpoints =>
{
    endpoints.MapControllers();
    endpoints.MapFallbackToFile("index.html");
});
app.Run();