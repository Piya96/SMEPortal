using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace SME.Portal.Migrations
{
    public partial class Adding_fields_for_email_confirmation_reminder : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "EmailConfirmationReminderSent",
                table: "AbpUsers",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<DateTime>(
                name: "EmailConfirmationReminderSentDateUtc",
                table: "AbpUsers",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "EmailConfirmationSentDateUtc",
                table: "AbpUsers",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "EmailConfirmationReminderSent",
                table: "AbpUsers");

            migrationBuilder.DropColumn(
                name: "EmailConfirmationReminderSentDateUtc",
                table: "AbpUsers");

            migrationBuilder.DropColumn(
                name: "EmailConfirmationSentDateUtc",
                table: "AbpUsers");
        }
    }
}