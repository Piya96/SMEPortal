using Microsoft.EntityFrameworkCore.Migrations;

namespace SME.Portal.Migrations
{
    public partial class Altered_Invoices_removed_tenant_prefix : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "TenantAddress",
                table: "AppInvoices");

            migrationBuilder.DropColumn(
                name: "TenantLegalName",
                table: "AppInvoices");

            migrationBuilder.DropColumn(
                name: "TenantTaxNo",
                table: "AppInvoices");

            migrationBuilder.AddColumn<string>(
                name: "Address",
                table: "AppInvoices",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "LegalName",
                table: "AppInvoices",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TaxNo",
                table: "AppInvoices",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Address",
                table: "AppInvoices");

            migrationBuilder.DropColumn(
                name: "LegalName",
                table: "AppInvoices");

            migrationBuilder.DropColumn(
                name: "TaxNo",
                table: "AppInvoices");

            migrationBuilder.AddColumn<string>(
                name: "TenantAddress",
                table: "AppInvoices",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TenantLegalName",
                table: "AppInvoices",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TenantTaxNo",
                table: "AppInvoices",
                type: "nvarchar(max)",
                nullable: true);
        }
    }
}
