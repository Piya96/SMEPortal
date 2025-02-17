using Microsoft.EntityFrameworkCore.Migrations;

namespace SME.Portal.Migrations
{
    public partial class Alter_table_FinanceProducts_drop_FK_Match : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {

            migrationBuilder.DropIndex(
                name: "IX_FinanceProducts_MatchId",
                table: "FinanceProducts");

            migrationBuilder.DropColumn(
                name: "MatchId",
                table: "FinanceProducts");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "MatchId",
                table: "FinanceProducts",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_FinanceProducts_MatchId",
                table: "FinanceProducts",
                column: "MatchId");
            
        }
    }
}
