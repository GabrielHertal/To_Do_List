using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace To_Do_List.Server.Migrations
{
    /// <inheritdoc />
    public partial class corrige_migration2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<char>(
                name: "Status",
                table: "Tarefas",
                type: "character(1)",
                nullable: false,
                oldClrType: typeof(bool),
                oldType: "boolean");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<bool>(
                name: "Status",
                table: "Tarefas",
                type: "boolean",
                nullable: false,
                oldClrType: typeof(char),
                oldType: "character(1)");
        }
    }
}
