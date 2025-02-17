using Microsoft.EntityFrameworkCore.Migrations;

namespace SME.Portal.Migrations
{
    public partial class added_three_fields_to_sme_company : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "BeeLevel",
                table: "SmeCompanies",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Customers",
                table: "SmeCompanies",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Industries",
                table: "SmeCompanies",
                nullable: false,
                defaultValue: "");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "BeeLevel",
                table: "SmeCompanies");

            migrationBuilder.DropColumn(
                name: "Customers",
                table: "SmeCompanies");

            migrationBuilder.DropColumn(
                name: "Industries",
                table: "SmeCompanies");
        }
    }
}
