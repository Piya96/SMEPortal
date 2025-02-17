using Microsoft.EntityFrameworkCore.Migrations;

namespace SME.Portal.Migrations
{
    public partial class Adding_ResetFlag_Field_To_User : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ResetFlag",
                table: "AbpUsers",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ResetFlag",
                table: "AbpUsers");
        }
    }
}
