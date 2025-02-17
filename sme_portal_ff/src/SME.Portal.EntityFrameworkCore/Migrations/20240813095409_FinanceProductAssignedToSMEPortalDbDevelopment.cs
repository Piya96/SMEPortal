using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace SME.Portal.Migrations
{
    public partial class FinanceProductAssignedToSMEPortalDbDevelopment : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "AssignedTo",
                table: "FinanceProducts",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_FinanceProducts_AssignedTo",
                table: "FinanceProducts",
                column: "AssignedTo");

        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {

            migrationBuilder.DropIndex(
                name: "IX_FinanceProducts_AssignedTo",
                table: "FinanceProducts");

            migrationBuilder.DropColumn(
                name: "AssignedTo",
                table: "FinanceProducts");

        }
    }
}
