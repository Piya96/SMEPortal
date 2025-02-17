using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace SME.Portal.Migrations
{
    public partial class SubscriptionPayment_added_UserId_ExternalPaymentToken_SubscriptionStartEndPaymentType : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ExternalPaymentToken",
                table: "AppSubscriptionPayments",
                nullable: true);

            migrationBuilder.AddColumn<long>(
                name: "UserId",
                table: "AppSubscriptionPayments",
                nullable: false,
                defaultValue: 0L);

            migrationBuilder.AddColumn<DateTime>(
                name: "SubscriptionEndDate",
                table: "AbpUsers",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "SubscriptionPaymentType",
                table: "AbpUsers",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "SubscriptionStartDate",
                table: "AbpUsers",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_AppSubscriptionPayments_UserId",
                table: "AppSubscriptionPayments",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_AppSubscriptionPayments_AbpUsers_UserId",
                table: "AppSubscriptionPayments",
                column: "UserId",
                principalTable: "AbpUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AppSubscriptionPayments_AbpUsers_UserId",
                table: "AppSubscriptionPayments");

            migrationBuilder.DropIndex(
                name: "IX_AppSubscriptionPayments_UserId",
                table: "AppSubscriptionPayments");

            migrationBuilder.DropColumn(
                name: "ExternalPaymentToken",
                table: "AppSubscriptionPayments");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "AppSubscriptionPayments");

            migrationBuilder.DropColumn(
                name: "SubscriptionEndDate",
                table: "AbpUsers");

            migrationBuilder.DropColumn(
                name: "SubscriptionPaymentType",
                table: "AbpUsers");

            migrationBuilder.DropColumn(
                name: "SubscriptionStartDate",
                table: "AbpUsers");
        }
    }
}
