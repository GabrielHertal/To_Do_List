using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace To_Do_List.Server.Migrations
{
    /// <inheritdoc />
    public partial class novos_campos : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Ativo",
                table: "Users",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "IdUsuario",
                table: "Tarefas",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "usersId",
                table: "Tarefas",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                column: "Ativo",
                value: 2);

            migrationBuilder.CreateIndex(
                name: "IX_Tarefas_usersId",
                table: "Tarefas",
                column: "usersId");

            migrationBuilder.AddForeignKey(
                name: "FK_Tarefas_Users_usersId",
                table: "Tarefas",
                column: "usersId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Tarefas_Users_usersId",
                table: "Tarefas");

            migrationBuilder.DropIndex(
                name: "IX_Tarefas_usersId",
                table: "Tarefas");

            migrationBuilder.DropColumn(
                name: "Ativo",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "IdUsuario",
                table: "Tarefas");

            migrationBuilder.DropColumn(
                name: "usersId",
                table: "Tarefas");
        }
    }
}
