using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace SME.Portal.Migrations
{
    public partial class SummaryFinanceProductCommentMigration : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_LendersComment_LenderId",
                table: "LendersComment");

            migrationBuilder.AlterColumn<string>(
                name: "Text",
                table: "LendersComment",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Summary",
                table: "FinanceProducts",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "FinanceProductComment",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CreationTime = table.Column<DateTime>(nullable: false),
                    CreatorUserId = table.Column<long>(nullable: true),
                    LastModificationTime = table.Column<DateTime>(nullable: true),
                    LastModifierUserId = table.Column<long>(nullable: true),
                    IsDeleted = table.Column<bool>(nullable: false),
                    DeleterUserId = table.Column<long>(nullable: true),
                    DeletionTime = table.Column<DateTime>(nullable: true),
                    Text = table.Column<string>(nullable: false),
                    FinanceProductId = table.Column<int>(nullable: false),
                    UserId = table.Column<long>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FinanceProductComment", x => x.Id);
                    table.ForeignKey(
                        name: "FK_FinanceProductComment_FinanceProducts_FinanceProductId",
                        column: x => x.FinanceProductId,
                        principalTable: "FinanceProducts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_FinanceProductComment_AbpUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AbpUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_LendersComment_LenderId_Text",
                table: "LendersComment",
                columns: new[] { "LenderId", "Text" },
                unique: true,
                filter: "[Text] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_FinanceProductComment_UserId",
                table: "FinanceProductComment",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_FinanceProductComment_FinanceProductId_Text",
                table: "FinanceProductComment",
                columns: new[] { "FinanceProductId", "Text" },
                unique: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "FinanceProductComment");

            migrationBuilder.DropIndex(
                name: "IX_LendersComment_LenderId_Text",
                table: "LendersComment");

            migrationBuilder.DropColumn(
                name: "Summary",
                table: "FinanceProducts");

            migrationBuilder.AlterColumn<string>(
                name: "Text",
                table: "LendersComment",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldNullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_LendersComment_LenderId",
                table: "LendersComment",
                column: "LenderId");
        }
    }
}
