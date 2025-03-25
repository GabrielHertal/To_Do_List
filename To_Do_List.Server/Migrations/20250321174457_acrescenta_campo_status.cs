using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace To_Do_List.Server.Migrations
{
    /// <inheritdoc />
    public partial class acrescenta_campo_status : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Concluida",
                table: "Tarefas",
                newName: "Status");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Status",
                table: "Tarefas",
                newName: "Concluida");
        }
    }
}
