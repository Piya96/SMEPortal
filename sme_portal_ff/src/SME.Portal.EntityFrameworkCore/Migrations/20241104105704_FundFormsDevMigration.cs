using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace SME.Portal.Migrations
{
    public partial class FundFormsDevMigration : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "City",
                table: "FundForms",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "FinanceProductName",
                table: "FundForms",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "LenderId",
                table: "FundForms",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "LenderName",
                table: "FundForms",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "LenderType",
                table: "FundForms",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "MatchCriteriaJson",
                table: "FundForms",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PhysicalAddressLineOne",
                table: "FundForms",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PhysicalAddressLineThree",
                table: "FundForms",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PhysicalAddressLineTwo",
                table: "FundForms",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "PostalCode",
                table: "FundForms",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Province",
                table: "FundForms",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "ReSendExpiredFundForm",
                table: "FundForms",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "SentExpireEmail",
                table: "FundForms",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "SentReminderEmail",
                table: "FundForms",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "TenantId",
                table: "FundForms",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "Token",
                table: "FundForms",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "City",
                table: "FundForms");

            migrationBuilder.DropColumn(
                name: "FinanceProductName",
                table: "FundForms");

            migrationBuilder.DropColumn(
                name: "LenderId",
                table: "FundForms");

            migrationBuilder.DropColumn(
                name: "LenderName",
                table: "FundForms");

            migrationBuilder.DropColumn(
                name: "LenderType",
                table: "FundForms");

            migrationBuilder.DropColumn(
                name: "MatchCriteriaJson",
                table: "FundForms");

            migrationBuilder.DropColumn(
                name: "PhysicalAddressLineOne",
                table: "FundForms");

            migrationBuilder.DropColumn(
                name: "PhysicalAddressLineThree",
                table: "FundForms");

            migrationBuilder.DropColumn(
                name: "PhysicalAddressLineTwo",
                table: "FundForms");

            migrationBuilder.DropColumn(
                name: "PostalCode",
                table: "FundForms");

            migrationBuilder.DropColumn(
                name: "Province",
                table: "FundForms");

            migrationBuilder.DropColumn(
                name: "ReSendExpiredFundForm",
                table: "FundForms");

            migrationBuilder.DropColumn(
                name: "SentExpireEmail",
                table: "FundForms");

            migrationBuilder.DropColumn(
                name: "SentReminderEmail",
                table: "FundForms");

            migrationBuilder.DropColumn(
                name: "TenantId",
                table: "FundForms");

            migrationBuilder.DropColumn(
                name: "Token",
                table: "FundForms");

        }
    }
}
