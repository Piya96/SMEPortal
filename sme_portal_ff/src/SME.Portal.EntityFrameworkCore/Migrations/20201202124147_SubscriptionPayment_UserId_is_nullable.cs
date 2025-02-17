using Microsoft.EntityFrameworkCore.Migrations;

namespace SME.Portal.Migrations
{
    public partial class SubscriptionPayment_UserId_is_nullable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AppSubscriptionPayments_AbpUsers_UserId",
                table: "AppSubscriptionPayments");

            migrationBuilder.AlterColumn<long>(
                name: "UserId",
                table: "AppSubscriptionPayments",
                nullable: true,
                oldClrType: typeof(long),
                oldType: "bigint");

            migrationBuilder.AddForeignKey(
                name: "FK_AppSubscriptionPayments_AbpUsers_UserId",
                table: "AppSubscriptionPayments",
                column: "UserId",
                principalTable: "AbpUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AppSubscriptionPayments_AbpUsers_UserId",
                table: "AppSubscriptionPayments");

            migrationBuilder.AlterColumn<long>(
                name: "UserId",
                table: "AppSubscriptionPayments",
                type: "bigint",
                nullable: false,
                oldClrType: typeof(long),
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_AppSubscriptionPayments_AbpUsers_UserId",
                table: "AppSubscriptionPayments",
                column: "UserId",
                principalTable: "AbpUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
