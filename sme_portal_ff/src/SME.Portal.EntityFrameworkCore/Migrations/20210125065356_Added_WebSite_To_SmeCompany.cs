using Microsoft.EntityFrameworkCore.Migrations;

namespace SME.Portal.Migrations
{
    public partial class Added_WebSite_To_SmeCompany : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "WebSite",
                table: "SmeCompanies",
                nullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "TenantId",
                table: "Matches",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "WebSite",
                table: "SmeCompanies");

            migrationBuilder.AlterColumn<int>(
                name: "TenantId",
                table: "Matches",
                type: "int",
                nullable: true,
                oldClrType: typeof(int));
        }
    }
}
