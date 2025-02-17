using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace SME.Portal.Migrations
{
    public partial class Created_CurrencyPairs_Entity : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "CurrencyPairs",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CreationTime = table.Column<DateTime>(nullable: false),
                    CreatorUserId = table.Column<long>(nullable: true),
                    LastModificationTime = table.Column<DateTime>(nullable: true),
                    LastModifierUserId = table.Column<long>(nullable: true),
                    Name = table.Column<string>(maxLength: 100, nullable: false),
                    BaseCurrencyCode = table.Column<string>(nullable: false),
                    TargetCurrencyCode = table.Column<string>(nullable: false),
                    ExchangeRate = table.Column<decimal>(nullable: false),
                    Symbol = table.Column<string>(nullable: false),
                    Log = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CurrencyPairs", x => x.Id);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CurrencyPairs");
        }
    }
}
