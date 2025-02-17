using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace SME.Portal.Migrations
{
    public partial class LenderPageDevelopment : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsSection12J",
                table: "Lenders");

            migrationBuilder.DropColumn(
                name: "LogoName",
                table: "Lenders");

            migrationBuilder.DropColumn(
                name: "Permalink",
                table: "Lenders");

            migrationBuilder.AddColumn<int>(
                name: "AccountManager",
                table: "Lenders",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "City",
                table: "Lenders",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Country",
                table: "Lenders",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "HasContract",
                table: "Lenders",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "HeadOfficeProvince",
                table: "Lenders",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "LenderType",
                table: "Lenders",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PhysicalAddressLineOne",
                table: "Lenders",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PhysicalAddressLineThree",
                table: "Lenders",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PhysicalAddressLineTwo",
                table: "Lenders",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "PostalCode",
                table: "Lenders",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Province",
                table: "Lenders",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Comment",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CreatorUserId = table.Column<long>(nullable: true),
                    LastModificationTime = table.Column<DateTime>(nullable: true),
                    LastModifierUserId = table.Column<long>(nullable: true),
                    IsDeleted = table.Column<bool>(nullable: false),
                    DeleterUserId = table.Column<long>(nullable: true),
                    DeletionTime = table.Column<DateTime>(nullable: true),
                    CreationTime = table.Column<DateTime>(nullable: false),
                    Text = table.Column<string>(nullable: true),
                    LenderId = table.Column<int>(nullable: false),
                    UserId = table.Column<long>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Comment", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Comment_Lenders_LenderId",
                        column: x => x.LenderId,
                        principalTable: "Lenders",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Comment_AbpUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AbpUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Comment_LenderId",
                table: "Comment",
                column: "LenderId");

            migrationBuilder.CreateIndex(
                name: "IX_Comment_UserId",
                table: "Comment",
                column: "UserId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Comment");

            migrationBuilder.DropColumn(
                name: "AccountManager",
                table: "Lenders");

            migrationBuilder.DropColumn(
                name: "City",
                table: "Lenders");

            migrationBuilder.DropColumn(
                name: "Country",
                table: "Lenders");

            migrationBuilder.DropColumn(
                name: "HasContract",
                table: "Lenders");

            migrationBuilder.DropColumn(
                name: "HeadOfficeProvince",
                table: "Lenders");

            migrationBuilder.DropColumn(
                name: "LenderType",
                table: "Lenders");

            migrationBuilder.DropColumn(
                name: "PhysicalAddressLineOne",
                table: "Lenders");

            migrationBuilder.DropColumn(
                name: "PhysicalAddressLineThree",
                table: "Lenders");

            migrationBuilder.DropColumn(
                name: "PhysicalAddressLineTwo",
                table: "Lenders");

            migrationBuilder.DropColumn(
                name: "PostalCode",
                table: "Lenders");

            migrationBuilder.DropColumn(
                name: "Province",
                table: "Lenders");

            migrationBuilder.AddColumn<bool>(
                name: "IsSection12J",
                table: "Lenders",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "LogoName",
                table: "Lenders",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Permalink",
                table: "Lenders",
                type: "nvarchar(max)",
                nullable: true);
        }
    }
}
