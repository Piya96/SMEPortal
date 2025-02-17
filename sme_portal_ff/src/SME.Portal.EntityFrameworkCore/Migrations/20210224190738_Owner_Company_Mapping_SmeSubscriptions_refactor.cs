using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace SME.Portal.Migrations
{
    public partial class Owner_Company_Mapping_SmeSubscriptions_refactor : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Applications_SmeCompanies_SmeCompanyId",
                table: "Applications");

            migrationBuilder.DropForeignKey(
                name: "FK_Documents_SmeCompanies_SmeCompanyId",
                table: "Documents");

            migrationBuilder.DropForeignKey(
                name: "FK_Owners_SmeCompanies_SmeCompanyId",
                table: "Owners");

            migrationBuilder.DropForeignKey(
                name: "FK_SmeCompanies_AbpEditions_EditionId",
                table: "SmeCompanies");

            migrationBuilder.DropForeignKey(
                name: "FK_SmeCompanies_AbpUsers_UserId",
                table: "SmeCompanies");

            migrationBuilder.DropIndex(
                name: "IX_Owners_SmeCompanyId",
                table: "Owners");

            migrationBuilder.DropPrimaryKey(
                name: "PK_SmeCompanies",
                table: "SmeCompanies");

            migrationBuilder.DropIndex(
                name: "IX_SmeCompanies_EditionId",
                table: "SmeCompanies");

            migrationBuilder.DropColumn(
                name: "SmeCompanyId",
                table: "Owners");

            migrationBuilder.DropColumn(
                name: "EditionId",
                table: "SmeCompanies");

            migrationBuilder.RenameTable(
                name: "SmeCompanies",
                newName: "Companies");

            migrationBuilder.RenameIndex(
                name: "IX_SmeCompanies_UserId",
                table: "Companies",
                newName: "IX_Companies_UserId");

            migrationBuilder.RenameIndex(
                name: "IX_SmeCompanies_TenantId",
                table: "Companies",
                newName: "IX_Companies_TenantId");

            migrationBuilder.AddColumn<int>(
                name: "SmeSubscriptionId",
                table: "AppSubscriptionPayments",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddPrimaryKey(
                name: "PK_Companies",
                table: "Companies",
                column: "Id");

            migrationBuilder.CreateTable(
                name: "OwnerCompanyMapping",
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
                    TenantId = table.Column<int>(nullable: false),
                    IsPrimaryOwner = table.Column<bool>(nullable: false),
                    OwnerId = table.Column<long>(nullable: true),
                    SmeCompanyId = table.Column<int>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OwnerCompanyMapping", x => x.Id);
                    table.ForeignKey(
                        name: "FK_OwnerCompanyMapping_Owners_OwnerId",
                        column: x => x.OwnerId,
                        principalTable: "Owners",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_OwnerCompanyMapping_Companies_SmeCompanyId",
                        column: x => x.SmeCompanyId,
                        principalTable: "Companies",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "SmeSubscriptions",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TenantId = table.Column<int>(nullable: false),
                    StartDate = table.Column<DateTime>(nullable: false),
                    ExpiryDate = table.Column<DateTime>(nullable: true),
                    NextBillingDate = table.Column<DateTime>(nullable: true),
                    Status = table.Column<string>(nullable: false),
                    EditionId = table.Column<int>(nullable: false),
                    OwnerCompanyMapId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SmeSubscriptions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SmeSubscriptions_AbpEditions_EditionId",
                        column: x => x.EditionId,
                        principalTable: "AbpEditions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_SmeSubscriptions_OwnerCompanyMapping_OwnerCompanyMapId",
                        column: x => x.OwnerCompanyMapId,
                        principalTable: "OwnerCompanyMapping",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_OwnerCompanyMapping_OwnerId",
                table: "OwnerCompanyMapping",
                column: "OwnerId");

            migrationBuilder.CreateIndex(
                name: "IX_OwnerCompanyMapping_SmeCompanyId",
                table: "OwnerCompanyMapping",
                column: "SmeCompanyId");

            migrationBuilder.CreateIndex(
                name: "IX_OwnerCompanyMapping_TenantId",
                table: "OwnerCompanyMapping",
                column: "TenantId");

            migrationBuilder.CreateIndex(
                name: "IX_SmeSubscriptions_EditionId",
                table: "SmeSubscriptions",
                column: "EditionId");

            migrationBuilder.CreateIndex(
                name: "IX_SmeSubscriptions_OwnerCompanyMapId",
                table: "SmeSubscriptions",
                column: "OwnerCompanyMapId");

            migrationBuilder.CreateIndex(
                name: "IX_SmeSubscriptions_TenantId",
                table: "SmeSubscriptions",
                column: "TenantId");

            migrationBuilder.AddForeignKey(
                name: "FK_Applications_Companies_SmeCompanyId",
                table: "Applications",
                column: "SmeCompanyId",
                principalTable: "Companies",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Companies_AbpUsers_UserId",
                table: "Companies",
                column: "UserId",
                principalTable: "AbpUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.NoAction);

            migrationBuilder.AddForeignKey(
                name: "FK_Documents_Companies_SmeCompanyId",
                table: "Documents",
                column: "SmeCompanyId",
                principalTable: "Companies",
                principalColumn: "Id",
                onDelete: ReferentialAction.NoAction);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Applications_Companies_SmeCompanyId",
                table: "Applications");

            migrationBuilder.DropForeignKey(
                name: "FK_Companies_AbpUsers_UserId",
                table: "Companies");

            migrationBuilder.DropForeignKey(
                name: "FK_Documents_Companies_SmeCompanyId",
                table: "Documents");

            migrationBuilder.DropTable(
                name: "SmeSubscriptions");

            migrationBuilder.DropTable(
                name: "OwnerCompanyMapping");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Companies",
                table: "Companies");

            migrationBuilder.DropColumn(
                name: "SmeSubscriptionId",
                table: "AppSubscriptionPayments");

            migrationBuilder.RenameTable(
                name: "Companies",
                newName: "SmeCompanies");

            migrationBuilder.RenameIndex(
                name: "IX_Companies_UserId",
                table: "SmeCompanies",
                newName: "IX_SmeCompanies_UserId");

            migrationBuilder.RenameIndex(
                name: "IX_Companies_TenantId",
                table: "SmeCompanies",
                newName: "IX_SmeCompanies_TenantId");

            migrationBuilder.AddColumn<int>(
                name: "SmeCompanyId",
                table: "Owners",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "EditionId",
                table: "SmeCompanies",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddPrimaryKey(
                name: "PK_SmeCompanies",
                table: "SmeCompanies",
                column: "Id");

            migrationBuilder.CreateIndex(
                name: "IX_Owners_SmeCompanyId",
                table: "Owners",
                column: "SmeCompanyId");

            migrationBuilder.CreateIndex(
                name: "IX_SmeCompanies_EditionId",
                table: "SmeCompanies",
                column: "EditionId");

            migrationBuilder.AddForeignKey(
                name: "FK_Applications_SmeCompanies_SmeCompanyId",
                table: "Applications",
                column: "SmeCompanyId",
                principalTable: "SmeCompanies",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Documents_SmeCompanies_SmeCompanyId",
                table: "Documents",
                column: "SmeCompanyId",
                principalTable: "SmeCompanies",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Owners_SmeCompanies_SmeCompanyId",
                table: "Owners",
                column: "SmeCompanyId",
                principalTable: "SmeCompanies",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_SmeCompanies_AbpEditions_EditionId",
                table: "SmeCompanies",
                column: "EditionId",
                principalTable: "AbpEditions",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_SmeCompanies_AbpUsers_UserId",
                table: "SmeCompanies",
                column: "UserId",
                principalTable: "AbpUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
