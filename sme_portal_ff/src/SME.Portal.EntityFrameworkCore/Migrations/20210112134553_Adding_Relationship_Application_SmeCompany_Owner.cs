using Microsoft.EntityFrameworkCore.Migrations;

namespace SME.Portal.Migrations
{
    public partial class Adding_Relationship_Application_SmeCompany_Owner : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {

            migrationBuilder.AlterColumn<int>(
                name: "TenantId",
                table: "Applications",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddForeignKey(
                name: "FK_Applications_SmeCompanies_SmeCompanyId",
                table: "Applications",
                column: "SmeCompanyId",
                principalTable: "SmeCompanies",
                principalColumn: "Id",
                onDelete: ReferentialAction.NoAction);

            migrationBuilder.AddForeignKey(
                name: "FK_SmeCompanies_Owners_OwnerId",
                table: "SmeCompanies",
                column: "OwnerId",
                principalTable: "Owners",
                principalColumn: "Id",
                onDelete: ReferentialAction.NoAction);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Applications_SmeCompanies_SmeCompanyId",
                table: "Applications");

            migrationBuilder.DropForeignKey(
                name: "FK_SmeCompanies_Owners_OwnerId",
                table: "SmeCompanies");

            migrationBuilder.DropIndex(
                name: "IX_SmeCompanies_OwnerId",
                table: "SmeCompanies");

            migrationBuilder.DropIndex(
                name: "IX_Applications_SmeCompanyId",
                table: "Applications");

            migrationBuilder.DropColumn(
                name: "OwnerId",
                table: "SmeCompanies");

            migrationBuilder.DropColumn(
                name: "SmeCompanyId",
                table: "Applications");

            migrationBuilder.AlterColumn<int>(
                name: "TenantId",
                table: "Applications",
                type: "int",
                nullable: false,
                oldClrType: typeof(int),
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "MatchId",
                table: "Applications",
                type: "int",
                nullable: true);

            
        }
    }
}
