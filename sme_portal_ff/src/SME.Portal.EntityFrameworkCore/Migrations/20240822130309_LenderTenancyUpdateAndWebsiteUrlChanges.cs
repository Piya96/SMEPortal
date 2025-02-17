using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace SME.Portal.Migrations
{
    public partial class LenderTenancyUpdateAndWebsiteUrlChanges : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Province",
                table: "Lenders",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "HeadOfficeProvince",
                table: "Lenders",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "TenantId",
                table: "Lenders",
                nullable: false,
                defaultValue: 2);

            migrationBuilder.CreateTable(
                name: "WebsiteUrl",
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
                    Url = table.Column<string>(maxLength: 1000, nullable: false),
                    FinanceProductId = table.Column<int>(nullable: false),
                    IsPrimary = table.Column<bool>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_WebsiteUrl", x => x.Id);
                    table.ForeignKey(
                        name: "FK_WebsiteUrl_FinanceProducts_FinanceProductId",
                        column: x => x.FinanceProductId,
                        principalTable: "FinanceProducts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Lenders_TenantId_Name",
                table: "Lenders",
                columns: new[] { "TenantId", "Name" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_WebsiteUrl_FinanceProductId",
                table: "WebsiteUrl",
                column: "FinanceProductId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "WebsiteUrl");

            migrationBuilder.DropIndex(
                name: "IX_Lenders_TenantId_Name",
                table: "Lenders");

            migrationBuilder.DropColumn(
                name: "TenantId",
                table: "Lenders");

            migrationBuilder.AlterColumn<int>(
                name: "Province",
                table: "Lenders",
                type: "int",
                nullable: true,
                oldClrType: typeof(string),
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "HeadOfficeProvince",
                table: "Lenders",
                type: "int",
                nullable: true,
                oldClrType: typeof(string),
                oldNullable: true);
        }
    }
}
