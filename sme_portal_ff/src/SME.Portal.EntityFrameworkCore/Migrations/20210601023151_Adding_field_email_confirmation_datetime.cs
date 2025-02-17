using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace SME.Portal.Migrations
{
    public partial class Adding_field_email_confirmation_datetime : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "EmailConfirmedDateUtc",
                table: "AbpUsers",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "EmailConfirmedDateUtc",
                table: "AbpUsers");
        }
    }
}
