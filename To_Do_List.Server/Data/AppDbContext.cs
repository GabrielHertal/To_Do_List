using Microsoft.EntityFrameworkCore;
using To_Do_List.Server.Models;

namespace To_Do_List.Server.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }
        public DbSet<Tarefas> Tarefas { get; set; }
        public DbSet<Users> Users { get; set; }
        public DbSet<Quadro> Quadro { get; set; }
        public DbSet<Inter_Quadro_Users> Inter_Quadro_Users { get; set; }
        public DbSet<Inter_Tarefa_Quadro> Inter_Tarefa_Quadro { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<Users>().HasData(new Users
            {
                Id = 1,
                Nome = "Admin",
                Email = "admin@admin.com",
                Senha = "123",
                Ativo = 2
            });
            modelBuilder.Entity<Inter_Quadro_Users>().HasKey(i => new { i.Fk_Id_Users, i.Fk_Id_Quadro});
            modelBuilder.Entity<Inter_Tarefa_Quadro>().HasKey(i => new {i.Fk_Id_Tarefa, i.Fk_Id_Quadro});
        }
    }
}