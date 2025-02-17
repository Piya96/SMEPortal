using Microsoft.EntityFrameworkCore.Migrations;

namespace SME.Portal.Migrations
{
    public partial class Removed_Fk_OwnerId_from_SmeCompanies_added_Fk_SmeCompanyId_to_Owners : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SmeCompanies_Owners_OwnerId",
                table: "SmeCompanies");

            migrationBuilder.DropIndex(
                name: "IX_SmeCompanies_OwnerId",
                table: "SmeCompanies");

            migrationBuilder.DropColumn(
                name: "OwnerId",
                table: "SmeCompanies");

            migrationBuilder.AddColumn<int>(
                name: "SmeCompanyId",
                table: "Owners",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Owners_SmeCompanyId",
                table: "Owners",
                column: "SmeCompanyId");

            migrationBuilder.AddForeignKey(
                name: "FK_Owners_SmeCompanies_SmeCompanyId",
                table: "Owners",
                column: "SmeCompanyId",
                principalTable: "SmeCompanies",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Owners_SmeCompanies_SmeCompanyId",
                table: "Owners");

            migrationBuilder.DropIndex(
                name: "IX_Owners_SmeCompanyId",
                table: "Owners");

            migrationBuilder.DropColumn(
                name: "SmeCompanyId",
                table: "Owners");

            migrationBuilder.AddColumn<long>(
                name: "OwnerId",
                table: "SmeCompanies",
                type: "bigint",
                nullable: false,
                defaultValue: 0L);

            migrationBuilder.CreateIndex(
                name: "IX_SmeCompanies_OwnerId",
                table: "SmeCompanies",
                column: "OwnerId");

            migrationBuilder.AddForeignKey(
                name: "FK_SmeCompanies_Owners_OwnerId",
                table: "SmeCompanies",
                column: "OwnerId",
                principalTable: "Owners",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
