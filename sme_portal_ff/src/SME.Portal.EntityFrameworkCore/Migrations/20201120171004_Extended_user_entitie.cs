using Microsoft.EntityFrameworkCore.Migrations;

namespace SME.Portal.Migrations
{
    public partial class Extended_user_entitie : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "IdentityOrPassport",
                table: "AbpUsers",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsOwner",
                table: "AbpUsers",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "Race",
                table: "AbpUsers",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "RepresentativeCapacity",
                table: "AbpUsers",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "VerificationRecordJson",
                table: "AbpUsers",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IdentityOrPassport",
                table: "AbpUsers");

            migrationBuilder.DropColumn(
                name: "IsOwner",
                table: "AbpUsers");

            migrationBuilder.DropColumn(
                name: "Race",
                table: "AbpUsers");

            migrationBuilder.DropColumn(
                name: "RepresentativeCapacity",
                table: "AbpUsers");

            migrationBuilder.DropColumn(
                name: "VerificationRecordJson",
                table: "AbpUsers");
        }
    }
}
