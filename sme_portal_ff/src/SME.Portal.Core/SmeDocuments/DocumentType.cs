using System;
using System.Collections.Generic;
using System.Text;

namespace SME.Portal.SmeDocuments
{
    public struct DocumentType
    {
        public DocumentType(string id, string name)
        {
            Id = id;
            Name = name;
        }
        public string Id { get; set; }
        public string Name { get; set; }

        public override string ToString()
        {
            return Id;
        }
    }
    public static class DocumentTypes
    {
        public static readonly DocumentType Cipc = new DocumentType("5aaf6d123a022727ec3b587a", "CIPC");
        public static readonly DocumentType CipcAnnualReturn = new DocumentType("60549c63a2b3b4fb7c24bb34", "CIPC Annual Return");
        public static readonly DocumentType BeeCertificate = new DocumentType("60549db9e3032aa608a98cc1", "BEE Certificate");
        public static readonly DocumentType OwnersCertIdentity = new DocumentType("5ab0cdb53efed8141436959b", "Owners Identity");
        public static readonly DocumentType BankStatement = new DocumentType("5aaf6d193a022727ec3b587b", "Bank Statement");
        public static readonly DocumentType AnnualFinancialStatement = new DocumentType("5ab0cded3efed8141436959f", "Annual Financial Statement");
        public static readonly DocumentType ProofOfBusinessAddress = new DocumentType("5b2a54ecb958c008605883ff", "Proof Of Business Address");
        public static readonly DocumentType TwelveMonthsBudgeting = new DocumentType("5ab0ce1d3efed814143695a1", "Twelve Months Budgeting");
        public static readonly DocumentType BusinessPlan = new DocumentType("5ab0cde13efed8141436959e", "Business Plan");
        public static readonly DocumentType TaxClearanceCert = new DocumentType("5ab0cdc33efed8141436959c", "Tax Clearance Certificate");
        public static readonly DocumentType ManagementAccounts = new DocumentType("5ab0cdfc3efed814143695a0", "Management Accounts");
        public static readonly DocumentType StatementOfAssetsAndLiabilities = new DocumentType("5ab0cdd73efed8141436959d", "Statement Of Assets And Liabilities");
        public static readonly DocumentType FunderSearchSummary = new DocumentType("60ca4adae346e778b625ccb9", "Funder Search Summary");
        public static readonly DocumentType SefaDLFinanceApplication = new DocumentType("5bf68b99585f4b13f42a89a5", "Sefa Finance Application");

        private static List<DocumentType> DocumentTypeList = new List<DocumentType>()
        {
            Cipc,CipcAnnualReturn,BeeCertificate,OwnersCertIdentity,BankStatement,AnnualFinancialStatement,ProofOfBusinessAddress,
            TwelveMonthsBudgeting,BusinessPlan,TaxClearanceCert,ManagementAccounts,StatementOfAssetsAndLiabilities,SefaDLFinanceApplication
        };
        public static DocumentType GetDocumentTypeById(Guid uuid)
        {
            return DocumentTypeList.Find(r => r.Id == uuid.ToString());
        }

        public static DocumentType GetDocumentTypeById(string id)
        {
            return DocumentTypeList.Find(r => r.Id == id);
        }

        public static DocumentType GetDocumentTypeByName(string name)
        {
            return DocumentTypeList.Find(r => r.Name == name);
        }

        public static List<DocumentType> GetAllDocumentTypes()
        {
            return DocumentTypeList;
        }
    }
}
