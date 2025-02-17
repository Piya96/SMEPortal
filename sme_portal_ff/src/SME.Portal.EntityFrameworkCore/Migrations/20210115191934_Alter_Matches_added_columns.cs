using Microsoft.EntityFrameworkCore.Migrations;

namespace SME.Portal.Migrations
{
    public partial class Alter_Matches_added_columns : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_FinanceProducts_Matches_MatchId",
                table: "FinanceProducts");

            migrationBuilder.AlterColumn<int>(
                name: "TenantId",
                table: "Matches",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddColumn<int>(
                name: "ApplicationId",
                table: "Matches",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "ExclusionIds",
                table: "Matches",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "FinanceProductIds",
                table: "Matches",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "LeadDisplayName",
                table: "Matches",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<bool>(
                name: "MatchSuccessful",
                table: "Matches",
                nullable: false,
                defaultValue: false);

            migrationBuilder.CreateIndex(
                name: "IX_Matches_ApplicationId",
                table: "Matches",
                column: "ApplicationId");

            migrationBuilder.AddForeignKey(
                name: "FK_Matches_Applications_ApplicationId",
                table: "Matches",
                column: "ApplicationId",
                principalTable: "Applications",
                principalColumn: "Id",
                onDelete: ReferentialAction.NoAction);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_FinanceProducts_Matches_MatchId",
                table: "FinanceProducts");

            migrationBuilder.DropForeignKey(
                name: "FK_Matches_Applications_ApplicationId",
                table: "Matches");

            migrationBuilder.DropIndex(
                name: "IX_Matches_ApplicationId",
                table: "Matches");

            migrationBuilder.DropColumn(
                name: "ApplicationId",
                table: "Matches");

            migrationBuilder.DropColumn(
                name: "ExclusionIds",
                table: "Matches");

            migrationBuilder.DropColumn(
                name: "FinanceProductIds",
                table: "Matches");

            migrationBuilder.DropColumn(
                name: "LeadDisplayName",
                table: "Matches");

            migrationBuilder.DropColumn(
                name: "MatchSuccessful",
                table: "Matches");

            migrationBuilder.AlterColumn<int>(
                name: "TenantId",
                table: "Matches",
                type: "int",
                nullable: false,
                oldClrType: typeof(int),
                oldNullable: true);
            
        }
    }
}
