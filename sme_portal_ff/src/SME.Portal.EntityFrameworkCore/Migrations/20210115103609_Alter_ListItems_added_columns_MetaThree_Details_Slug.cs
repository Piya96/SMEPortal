using Microsoft.EntityFrameworkCore.Migrations;

namespace SME.Portal.Migrations
{
    public partial class Alter_ListItems_added_columns_MetaThree_Details_Slug : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Details",
                table: "ListItems",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "MetaThree",
                table: "ListItems",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Slug",
                table: "ListItems",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Details",
                table: "ListItems");

            migrationBuilder.DropColumn(
                name: "MetaThree",
                table: "ListItems");

            migrationBuilder.DropColumn(
                name: "Slug",
                table: "ListItems");
        }
    }
}
