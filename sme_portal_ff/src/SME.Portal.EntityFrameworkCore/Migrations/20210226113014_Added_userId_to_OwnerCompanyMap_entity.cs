using Microsoft.EntityFrameworkCore.Migrations;

namespace SME.Portal.Migrations
{
    public partial class Added_userId_to_OwnerCompanyMap_entity : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<long>(
                name: "UserId",
                table: "OwnerCompanyMapping",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_OwnerCompanyMapping_UserId",
                table: "OwnerCompanyMapping",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_OwnerCompanyMapping_AbpUsers_UserId",
                table: "OwnerCompanyMapping",
                column: "UserId",
                principalTable: "AbpUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_OwnerCompanyMapping_AbpUsers_UserId",
                table: "OwnerCompanyMapping");

            migrationBuilder.DropIndex(
                name: "IX_OwnerCompanyMapping_UserId",
                table: "OwnerCompanyMapping");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "OwnerCompanyMapping");
        }
    }
}
