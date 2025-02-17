using Microsoft.EntityFrameworkCore.Migrations;

namespace SME.Portal.Migrations
{
    public partial class Added_UpgradeEditionId_to_SubscribableEdition : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "UpgradeEditionId",
                table: "AbpEditions",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "UpgradeEditionId",
                table: "AbpEditions");
        }
    }
}
