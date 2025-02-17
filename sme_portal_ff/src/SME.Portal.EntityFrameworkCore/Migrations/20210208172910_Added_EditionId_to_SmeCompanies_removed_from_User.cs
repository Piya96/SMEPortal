using Microsoft.EntityFrameworkCore.Migrations;
using SME.Portal.Authorization.Users;

namespace SME.Portal.Migrations
{
    public partial class Added_EditionId_to_SmeCompanies_removed_from_User : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AbpUsers_AbpEditions_EditionId",
                table: "AbpUsers");

            migrationBuilder.DropIndex(
                name: "IX_AbpUsers_EditionId",
                table: "AbpUsers");

            migrationBuilder.DropColumn(
                name: "EditionId",
                table: "AbpUsers");

            migrationBuilder.AddColumn<int>(
                name: "EditionId",
                table: "SmeCompanies",
                nullable: false,
                defaultValue: UserConsts.DefaultEditionId );

            migrationBuilder.CreateIndex(
                name: "IX_SmeCompanies_EditionId",
                table: "SmeCompanies",
                column: "EditionId");

            migrationBuilder.AddForeignKey(
                name: "FK_SmeCompanies_AbpEditions_EditionId",
                table: "SmeCompanies",
                column: "EditionId",
                principalTable: "AbpEditions",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SmeCompanies_AbpEditions_EditionId",
                table: "SmeCompanies");

            migrationBuilder.DropIndex(
                name: "IX_SmeCompanies_EditionId",
                table: "SmeCompanies");

            migrationBuilder.DropColumn(
                name: "EditionId",
                table: "SmeCompanies");

            migrationBuilder.AddColumn<int>(
                name: "EditionId",
                table: "AbpUsers",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_AbpUsers_EditionId",
                table: "AbpUsers",
                column: "EditionId");

            migrationBuilder.AddForeignKey(
                name: "FK_AbpUsers_AbpEditions_EditionId",
                table: "AbpUsers",
                column: "EditionId",
                principalTable: "AbpEditions",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
