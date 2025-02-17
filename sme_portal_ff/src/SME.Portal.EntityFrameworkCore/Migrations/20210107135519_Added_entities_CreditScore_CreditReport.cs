using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace SME.Portal.Migrations
{
    public partial class Added_entities_CreditScore_CreditReport : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "CreditReports",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TenantId = table.Column<int>(nullable: true),
                    CreditReportJson = table.Column<string>(nullable: false),
                    EnquiryDate = table.Column<DateTime>(nullable: false),
                    UserId = table.Column<long>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CreditReports", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CreditReports_AbpUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AbpUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "CreditScores",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TenantId = table.Column<int>(nullable: false),
                    Score = table.Column<int>(nullable: false),
                    EnquiryDate = table.Column<DateTime>(nullable: false),
                    UserId = table.Column<long>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CreditScores", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CreditScores_AbpUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AbpUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_CreditReports_TenantId",
                table: "CreditReports",
                column: "TenantId");

            migrationBuilder.CreateIndex(
                name: "IX_CreditReports_UserId",
                table: "CreditReports",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_CreditScores_TenantId",
                table: "CreditScores",
                column: "TenantId");

            migrationBuilder.CreateIndex(
                name: "IX_CreditScores_UserId",
                table: "CreditScores",
                column: "UserId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CreditReports");

            migrationBuilder.DropTable(
                name: "CreditScores");
        }
    }
}
