using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace To_Do_List.Server.Migrations
{
    /// <inheritdoc />
    public partial class corrige_migration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Tarefas_Users_usersId",
                table: "Tarefas");

            migrationBuilder.DropColumn(
                name: "IdUsuario",
                table: "Tarefas");

            migrationBuilder.RenameColumn(
                name: "usersId",
                table: "Tarefas",
                newName: "FkIdUsuario");

            migrationBuilder.RenameIndex(
                name: "IX_Tarefas_usersId",
                table: "Tarefas",
                newName: "IX_Tarefas_FkIdUsuario");

            migrationBuilder.AddForeignKey(
                name: "FK_Tarefas_Users_FkIdUsuario",
                table: "Tarefas",
                column: "FkIdUsuario",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Tarefas_Users_FkIdUsuario",
                table: "Tarefas");

            migrationBuilder.RenameColumn(
                name: "FkIdUsuario",
                table: "Tarefas",
                newName: "usersId");

            migrationBuilder.RenameIndex(
                name: "IX_Tarefas_FkIdUsuario",
                table: "Tarefas",
                newName: "IX_Tarefas_usersId");

            migrationBuilder.AddColumn<int>(
                name: "IdUsuario",
                table: "Tarefas",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddForeignKey(
                name: "FK_Tarefas_Users_usersId",
                table: "Tarefas",
                column: "usersId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
