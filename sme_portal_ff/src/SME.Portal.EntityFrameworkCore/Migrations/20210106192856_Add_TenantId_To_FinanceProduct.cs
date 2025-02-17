using Microsoft.EntityFrameworkCore.Migrations;

namespace SME.Portal.Migrations
{
    public partial class Add_TenantId_To_FinanceProduct : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "TenantId",
                table: "FinanceProducts",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_FinanceProducts_TenantId",
                table: "FinanceProducts",
                column: "TenantId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_FinanceProducts_TenantId",
                table: "FinanceProducts");

            migrationBuilder.DropColumn(
                name: "TenantId",
                table: "FinanceProducts");
        }
    }
}
