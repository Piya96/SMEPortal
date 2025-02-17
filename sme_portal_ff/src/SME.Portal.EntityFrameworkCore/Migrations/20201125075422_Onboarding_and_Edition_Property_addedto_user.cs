using Microsoft.EntityFrameworkCore.Migrations;

namespace SME.Portal.Migrations
{
    public partial class Onboarding_and_Edition_Property_addedto_user : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "EditionId",
                table: "AbpUsers",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsOnboarded",
                table: "AbpUsers",
                nullable: false,
                defaultValue: false);

            migrationBuilder.CreateIndex(
                name: "IX_AbpUsers_EditionId",
                table: "AbpUsers",
                column: "EditionId");

            migrationBuilder.AddForeignKey(
                name: "FK_AbpUsers_AbpEditions_EditionId",
                table: "AbpUsers",
                column: "EditionId",
                principalTable: "AbpEditions",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AbpUsers_AbpEditions_EditionId",
                table: "AbpUsers");

            migrationBuilder.DropIndex(
                name: "IX_AbpUsers_EditionId",
                table: "AbpUsers");

            migrationBuilder.DropColumn(
                name: "EditionId",
                table: "AbpUsers");

            migrationBuilder.DropColumn(
                name: "IsOnboarded",
                table: "AbpUsers");
        }
    }
}
