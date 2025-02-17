using System;
using System.Collections.Generic;
using System.Text;
using System.Globalization;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace SME.Portal.ConsumerCredit
{
    public partial class CreditReportResponseDto
    {
        [JsonProperty("TemplateUsed")]
        public string TemplateUsed { get; set; }

        [JsonProperty("IDNumber")]
        public string IdNumber { get; set; }

        [JsonProperty("Reference")]
        public string Reference { get; set; }

        [JsonProperty("EnquiryReason")]
        public string EnquiryReason { get; set; }

        [JsonProperty("Enquiries")]
        public Enquiries Enquiries { get; set; }

        [JsonProperty("KYCResult")]
        public object KycResult { get; set; }

        [JsonProperty("MunicipalAccountSummary")]
        public MunicipalAccountSummary MunicipalAccountSummary { get; set; }

        [JsonProperty("StartDate")]
        public string StartDate { get; set; }

        [JsonProperty("ExpiryDate")]
        public string ExpiryDate { get; set; }

        [JsonProperty("DeceasedDetail")]
        public DeceasedDetail DeceasedDetail { get; set; }

        [JsonProperty("DebtReviewDetail")]
        public DebtReviewDetail DebtReviewDetail { get; set; }

        [JsonProperty("SAFPSDetail")]
        public SafpsDetail SafpsDetail { get; set; }

        [JsonProperty("SAFPPRDetail")]
        public SafpprDetail SafpprDetail { get; set; }

        [JsonProperty("Person")]
        public CreditReportResponseDtoPerson Person { get; set; }

        [JsonProperty("Addresses")]
        public Addresses Addresses { get; set; }

        [JsonProperty("Emails")]
        public Emails Emails { get; set; }

        [JsonProperty("Employment")]
        public Employment[] Employment { get; set; }

        [JsonProperty("Properties")]
        public Properties Properties { get; set; }

        [JsonProperty("PropertySummary")]
        public PropertySummary PropertySummary { get; set; }

        [JsonProperty("Judgments")]
        public Judgments Judgments { get; set; }

        [JsonProperty("TraceLocators")]
        public TraceLocators TraceLocators { get; set; }

        [JsonProperty("Disputes")]
        public Disputes Disputes { get; set; }

        [JsonProperty("Defaults")]
        public Defaults Defaults { get; set; }

        [JsonProperty("Directorships")]
        public Directorships Directorships { get; set; }

        [JsonProperty("PPSummary")]
        public CreditReportResponseDtoPpSummary PpSummary { get; set; }

        [JsonProperty("PPDetail")]
        public PpDetail PpDetail { get; set; }

        [JsonProperty("CreditScore")]
        public CreditScore CreditScore { get; set; }

        [JsonProperty("Notes")]
        public object[] Notes { get; set; }

        [JsonProperty("PDFFileName")]
        public string PdfFileName { get; set; }

        [JsonProperty("status_message")]
        public string StatusMessage { get; set; }

        [JsonProperty("bh_response_code")]
        public string BhResponseCode { get; set; }

        [JsonProperty("http_code")]
        [JsonConverter(typeof(ParseStringConverter))]
        public long HttpCode { get; set; }

        [JsonProperty("request_reference")]
        public Guid RequestReference { get; set; }

        [JsonProperty("Telephones")]
        public Telephones Telephones { get; set; }

        [JsonProperty("InputIDNumber")]
        public string InputIdNumber { get; set; }

        [JsonProperty("InputReference")]
        public string InputReference { get; set; }

        [JsonProperty("internalnotes")]
        public object Internalnotes { get; set; }

        [JsonProperty("EncodedPDF")]
        public string EncodedPdf { get; set; }
    }

    public partial class Addresses
    {
        [JsonProperty("OutputAddresses")]
        public OutputAddress[] OutputAddresses { get; set; }

        [JsonProperty("TotalRecords")]
        public long TotalRecords { get; set; }
    }

    public partial class OutputAddress
    {
        [JsonProperty("Address_id")]
        public long AddressId { get; set; }

        [JsonProperty("OriginalAddress")]
        public string OriginalAddress { get; set; }

        [JsonProperty("Score")]
        public long Score { get; set; }

        [JsonProperty("RankedScore")]
        public long RankedScore { get; set; }

        [JsonProperty("BuildingLine")]
        public string BuildingLine { get; set; }

        [JsonProperty("BoxLine")]
        public string BoxLine { get; set; }

        [JsonProperty("StreetLine")]
        public StreetLine StreetLine { get; set; }

        [JsonProperty("StreetNumber")]
        public string StreetNumber { get; set; }

        [JsonProperty("StreetName")]
        public string StreetName { get; set; }

        [JsonProperty("Suburb")]
        public string Suburb { get; set; }

        [JsonProperty("Town")]
        public Town Town { get; set; }

        [JsonProperty("PostCode")]
        public string PostCode { get; set; }

        [JsonProperty("Province")]
        public string Province { get; set; }

        [JsonProperty("Country")]
        public Country Country { get; set; }

        [JsonProperty("BoxOrStreet")]
        public string BoxOrStreet { get; set; }

        [JsonProperty("BureauSource")]
        public Source BureauSource { get; set; }

        [JsonProperty("Source")]
        public string Source { get; set; }

        [JsonProperty("AllSources")]
        public string[] AllSources { get; set; }

        [JsonProperty("MergedAddressDetail")]
        public MergedAddressDetail[] MergedAddressDetail { get; set; }

        [JsonProperty("Lat")]
        public string Lat { get; set; }

        [JsonProperty("Lon")]
        public string Lon { get; set; }

        [JsonProperty("RecordDate")]
        public DateTimeOffset RecordDate { get; set; }

        [JsonProperty("LatestDate")]
        public DateTimeOffset LatestDate { get; set; }

        [JsonProperty("FirstDate")]
        public DateTimeOffset FirstDate { get; set; }

        [JsonProperty("Status")]
        public FirstStatus Status { get; set; }

        [JsonProperty("AddressCleanDetails")]
        public string AddressCleanDetails { get; set; }

        [JsonProperty("AddressIsComplete")]
        public bool AddressIsComplete { get; set; }

        [JsonProperty("MeetsInformalFICRules")]
        public bool MeetsInformalFicRules { get; set; }

        [JsonProperty("MeetsFICRules")]
        public bool MeetsFicRules { get; set; }

        [JsonProperty("MeetsSARBRules")]
        public bool MeetsSarbRules { get; set; }

        [JsonProperty("MeetsSARSRules")]
        public bool MeetsSarsRules { get; set; }

        [JsonProperty("TotalSources")]
        public long TotalSources { get; set; }
    }

    public partial class MergedAddressDetail
    {
        [JsonProperty("OriginalAddress")]
        public string OriginalAddress { get; set; }

        [JsonProperty("Score")]
        public long Score { get; set; }

        [JsonProperty("BuildingLine")]
        public string BuildingLine { get; set; }

        [JsonProperty("BoxLine")]
        public string BoxLine { get; set; }

        [JsonProperty("StreetLine")]
        public StreetLine StreetLine { get; set; }

        [JsonProperty("Suburb")]
        public string Suburb { get; set; }

        [JsonProperty("Town")]
        public Town Town { get; set; }

        [JsonProperty("PostCode")]
        public string PostCode { get; set; }

        [JsonProperty("BureauSource")]
        public Source BureauSource { get; set; }

        [JsonProperty("Source")]
        public string Source { get; set; }

        [JsonProperty("Lat")]
        public string Lat { get; set; }

        [JsonProperty("Lon")]
        public string Lon { get; set; }

        [JsonProperty("RecordDate")]
        public DateTimeOffset RecordDate { get; set; }

        [JsonProperty("LatestDate")]
        public string LatestDate { get; set; }

        [JsonProperty("FirstDate")]
        public DateTimeOffset FirstDate { get; set; }

        [JsonProperty("Status")]
        public FirstStatus Status { get; set; }

        [JsonProperty("AddressCleanDetails")]
        public string AddressCleanDetails { get; set; }

        [JsonProperty("Country")]
        public Country Country { get; set; }

        [JsonProperty("MeetsFICRules")]
        public bool MeetsFicRules { get; set; }

        [JsonProperty("MeetsSARBRules")]
        public bool MeetsSarbRules { get; set; }

        [JsonProperty("MeetsSARSRules")]
        public bool MeetsSarsRules { get; set; }

        [JsonProperty("Address_id", NullValueHandling = NullValueHandling.Ignore)]
        public AddressId? AddressId { get; set; }

        [JsonProperty("RankedScore", NullValueHandling = NullValueHandling.Ignore)]
        public long? RankedScore { get; set; }

        [JsonProperty("StreetNumber", NullValueHandling = NullValueHandling.Ignore)]
        public string StreetNumber { get; set; }

        [JsonProperty("StreetName", NullValueHandling = NullValueHandling.Ignore)]
        public string StreetName { get; set; }

        [JsonProperty("Province", NullValueHandling = NullValueHandling.Ignore)]
        public FirstStatus? Province { get; set; }

        [JsonProperty("BoxOrStreet", NullValueHandling = NullValueHandling.Ignore)]
        public string BoxOrStreet { get; set; }

        [JsonProperty("AllSources", NullValueHandling = NullValueHandling.Ignore)]
        public object[] AllSources { get; set; }

        [JsonProperty("MergedAddressDetail", NullValueHandling = NullValueHandling.Ignore)]
        public object[] MergedAddressDetailMergedAddressDetail { get; set; }

        [JsonProperty("AddressIsComplete", NullValueHandling = NullValueHandling.Ignore)]
        public bool? AddressIsComplete { get; set; }

        [JsonProperty("MeetsInformalFICRules", NullValueHandling = NullValueHandling.Ignore)]
        public bool? MeetsInformalFicRules { get; set; }
    }

    public partial class CreditScoreList
    {
        [JsonProperty("CreditScoreList")]
        public CreditScoreList[] CreditScoreListObj { get; set; }
    }

    public partial class CreditScoreList
    {
        [JsonProperty("CreditScore")]
        public long CreditScore { get; set; }

        [JsonProperty("CreditScoreCategory")]
        public string CreditScoreCategory { get; set; }

        [JsonProperty("ScoreDate")]
        public DateTimeOffset ScoreDate { get; set; }
    }

    public partial class DebtReviewDetail
    {
        [JsonProperty("DebtReviewRecords")]
        public object[] DebtReviewRecords { get; set; }

        [JsonProperty("TotalRecords")]
        public long TotalRecords { get; set; }

        [JsonProperty("TotalReturnedRecords")]
        public long TotalReturnedRecords { get; set; }
    }

    public partial class DeceasedDetail
    {
        [JsonProperty("DeceasedRecords")]
        public object[] DeceasedRecords { get; set; }

        [JsonProperty("TotalRecords")]
        public long TotalRecords { get; set; }

        [JsonProperty("TotalReturnedRecords")]
        public long TotalReturnedRecords { get; set; }
    }

    public partial class Defaults
    {
        [JsonProperty("DefaultRecords")]
        public object[] DefaultRecords { get; set; }

        [JsonProperty("TotalRecords")]
        public long TotalRecords { get; set; }

        [JsonProperty("TotalReturnedRecords")]
        public long TotalReturnedRecords { get; set; }
    }

    public partial class Directorships
    {
        [JsonProperty("CIPCDirectors")]
        public object[] CipcDirectors { get; set; }

        [JsonProperty("TotalRecords")]
        public long TotalRecords { get; set; }

        [JsonProperty("TotalReturnedRecords")]
        public long TotalReturnedRecords { get; set; }
    }

    public partial class Disputes
    {
        [JsonProperty("DisputeRecords")]
        public object[] DisputeRecords { get; set; }

        [JsonProperty("TotalRecords")]
        public long TotalRecords { get; set; }

        [JsonProperty("TotalReturnedRecords")]
        public long TotalReturnedRecords { get; set; }
    }

    public partial class Emails
    {
        [JsonProperty("EmailAddresses")]
        public object[] EmailAddresses { get; set; }

        [JsonProperty("TotalRecords")]
        public long TotalRecords { get; set; }

        [JsonProperty("TotalReturnedRecords")]
        public long TotalReturnedRecords { get; set; }
    }

    public partial class Employment
    {
        [JsonProperty("IDNumber")]
        public string IdNumber { get; set; }

        [JsonProperty("Sector")]
        public FirstStatus Sector { get; set; }

        [JsonProperty("Occupation")]
        public string Occupation { get; set; }

        [JsonProperty("_PayrollNumber")]
        public string PayrollNumber { get; set; }

        [JsonProperty("_Salary")]
        public long Salary { get; set; }

        [JsonProperty("ContactPerson")]
        public string ContactPerson { get; set; }

        [JsonProperty("EmployerName")]
        public string EmployerName { get; set; }

        [JsonProperty("OriginalEmployerName")]
        public string OriginalEmployerName { get; set; }

        [JsonProperty("EmployerRegistrationNumber")]
        public string EmployerRegistrationNumber { get; set; }

        [JsonProperty("EmployerCompanyCIPCStatus")]
        public string EmployerCompanyCipcStatus { get; set; }

        [JsonProperty("EmployerBranchDetails")]
        public string EmployerBranchDetails { get; set; }

        [JsonProperty("EmployerContactTelephone")]
        public string EmployerContactTelephone { get; set; }

        [JsonProperty("EmployerTelephone")]
        public object[] EmployerTelephone { get; set; }

        [JsonProperty("EmployerEmailAddress")]
        public string EmployerEmailAddress { get; set; }

        [JsonProperty("EmployerAddressLine1")]
        public string EmployerAddressLine1 { get; set; }

        [JsonProperty("EmployerAddressLine2")]
        public string EmployerAddressLine2 { get; set; }

        [JsonProperty("EmployerAddressLine3")]
        public string EmployerAddressLine3 { get; set; }

        [JsonProperty("EmployerAddressLine4")]
        public string EmployerAddressLine4 { get; set; }

        [JsonProperty("EmployerAddressPostCode")]
        public string EmployerAddressPostCode { get; set; }

        [JsonProperty("FirstDate")]
        public DateTimeOffset FirstDate { get; set; }

        [JsonProperty("LatestDate")]
        public DateTimeOffset LatestDate { get; set; }

        [JsonProperty("FirstStatus")]
        public FirstStatus FirstStatus { get; set; }

        [JsonProperty("LatestStatus")]
        public FirstStatus LatestStatus { get; set; }

        [JsonProperty("RecordDate")]
        public DateTimeOffset RecordDate { get; set; }

        [JsonProperty("Score")]
        public long Score { get; set; }

        [JsonProperty("BureauSource")]
        public Source BureauSource { get; set; }

        [JsonProperty("Source")]
        public string[] Source { get; set; }

        [JsonProperty("KYCSource")]
        public string[] KycSource { get; set; }

        [JsonProperty("Reference")]
        public string Reference { get; set; }

        [JsonProperty("IDNumberTen")]
        public string IdNumberTen { get; set; }
    }

    public partial class Enquiries
    {
        [JsonProperty("Enquiries")]
        public Enquiry[] EnquiriesEnquiries { get; set; }

        [JsonProperty("TotalRecords")]
        public long TotalRecords { get; set; }

        [JsonProperty("TotalReturnedRecords")]
        public long TotalReturnedRecords { get; set; }

        [JsonProperty("status_message")]
        public string StatusMessage { get; set; }

        [JsonProperty("bh_response_code")]
        public string BhResponseCode { get; set; }

        [JsonProperty("http_code")]
        [JsonConverter(typeof(ParseStringConverter))]
        public long HttpCode { get; set; }

        [JsonProperty("request_reference")]
        public Guid RequestReference { get; set; }
    }

    public partial class Enquiry
    {
        [JsonProperty("IDNumber")]
        public string IdNumber { get; set; }

        [JsonProperty("IDNumberTen")]
        public string IdNumberTen { get; set; }

        [JsonProperty("EnquiryType")]
        public string EnquiryType { get; set; }

        [JsonProperty("EnquiryDate")]
        public DateTimeOffset EnquiryDate { get; set; }

        [JsonProperty("EnquiringCompany")]
        [JsonConverter(typeof(ParseStringConverter))]
        public long EnquiringCompany { get; set; }

        [JsonProperty("OperatorName")]
        public string OperatorName { get; set; }

        [JsonProperty("EnquiryPermissablePurpose")]
        public FirstStatus EnquiryPermissablePurpose { get; set; }

        [JsonProperty("EnquirySource")]
        public string EnquirySource { get; set; }
    }

    public partial class Judgments
    {
        [JsonProperty("JudgmentRecords")]
        public object[] JudgmentRecords { get; set; }

        [JsonProperty("TotalRecords")]
        public long TotalRecords { get; set; }

        [JsonProperty("TotalReturnedRecords")]
        public long TotalReturnedRecords { get; set; }
    }

    public partial class MunicipalAccountSummary
    {
        [JsonProperty("MunicipalSummary")]
        public object[] MunicipalSummary { get; set; }

        [JsonProperty("TotalRecords")]
        public long TotalRecords { get; set; }

        [JsonProperty("TotalReturnedRecords")]
        public long TotalReturnedRecords { get; set; }
    }

    public partial class CreditReportResponseDtoPerson
    {
        [JsonProperty("People")]
        public PersonElement[] People { get; set; }

        [JsonProperty("TotalRecords")]
        public long TotalRecords { get; set; }

        [JsonProperty("TotalReturnedRecords")]
        public long TotalReturnedRecords { get; set; }
    }

    public partial class PersonElement
    {
        [JsonProperty("InputIDNumber")]
        public string InputIdNumber { get; set; }

        [JsonProperty("IDNumber")]
        public string IdNumber { get; set; }

        [JsonProperty("ConsumerHashID")]
        public string ConsumerHashId { get; set; }

        [JsonProperty("Passport")]
        [JsonConverter(typeof(ParseStringConverter))]
        public long Passport { get; set; }

        [JsonProperty("FirstName")]
        public string FirstName { get; set; }

        [JsonProperty("SecondName")]
        public string SecondName { get; set; }

        [JsonProperty("ThirdName")]
        public string ThirdName { get; set; }

        [JsonProperty("Surname")]
        public string Surname { get; set; }

        [JsonProperty("MaidenName")]
        public string MaidenName { get; set; }

        [JsonProperty("DateOfBirth")]
        public DateTimeOffset DateOfBirth { get; set; }

        [JsonProperty("Age")]
        public long Age { get; set; }

        [JsonProperty("AgeBand")]
        public string AgeBand { get; set; }

        [JsonProperty("Title")]
        public string Title { get; set; }

        [JsonProperty("IsMinor")]
        public bool IsMinor { get; set; }

        [JsonProperty("InputIDPassedCDV")]
        public bool InputIdPassedCdv { get; set; }

        [JsonProperty("IDExists")]
        public bool IdExists { get; set; }

        [JsonProperty("Gender")]
        public string Gender { get; set; }

        [JsonProperty("MarriageDate")]
        public FirstStatus MarriageDate { get; set; }

        [JsonProperty("MaritalStatus")]
        public string MaritalStatus { get; set; }

        [JsonProperty("Score")]
        public long Score { get; set; }

        [JsonProperty("Country")]
        public Country Country { get; set; }

        [JsonProperty("Source")]
        public Source Source { get; set; }

        [JsonProperty("OriginalSource")]
        public Source OriginalSource { get; set; }

        [JsonProperty("LatestDate")]
        public DateTimeOffset LatestDate { get; set; }

        [JsonProperty("UsingDHARealtime")]
        public bool UsingDhaRealtime { get; set; }

        [JsonProperty("Reference")]
        public string Reference { get; set; }

        [JsonProperty("_Cached")]
        public bool Cached { get; set; }
    }

    public partial class PpDetail
    {
        [JsonProperty("PaymentProfile")]
        public PaymentProfile[] PaymentProfile { get; set; }

        [JsonProperty("PPSummary")]
        public PpSummaryElement[] PpSummary { get; set; }

        [JsonProperty("ThirdPartyName")]
        public string ThirdPartyName { get; set; }

        [JsonProperty("ThirdPartyDateSold")]
        public string ThirdPartyDateSold { get; set; }
    }

    public partial class PaymentProfile
    {
        [JsonProperty("Data")]
        public CurrentBalanceIndicator Data { get; set; }

        [JsonProperty("SAIDNumber")]
        public string SaidNumber { get; set; }

        [JsonProperty("NonSAIDNumber")]
        public string NonSaidNumber { get; set; }

        [JsonProperty("Gender")]
        public string Gender { get; set; }

        [JsonProperty("DateOfBirth")]
        [JsonConverter(typeof(ParseStringConverter))]
        public long DateOfBirth { get; set; }

        [JsonProperty("BranchCode")]
        public string BranchCode { get; set; }

        [JsonProperty("AccountNumber")]
        public string AccountNumber { get; set; }

        [JsonProperty("SubAccountNumber")]
        public string SubAccountNumber { get; set; }

        [JsonProperty("Surname")]
        public string Surname { get; set; }

        [JsonProperty("Title")]
        public string Title { get; set; }

        [JsonProperty("Forename1")]
        public string Forename1 { get; set; }

        [JsonProperty("Forename2")]
        public string Forename2 { get; set; }

        [JsonProperty("Forename3")]
        public string Forename3 { get; set; }

        [JsonProperty("ResidentialAddress1")]
        public string ResidentialAddress1 { get; set; }

        [JsonProperty("ResidentialAddress2")]
        public string ResidentialAddress2 { get; set; }

        [JsonProperty("ResidentialAddress3")]
        public string ResidentialAddress3 { get; set; }

        [JsonProperty("ResidentialAddress4")]
        public string ResidentialAddress4 { get; set; }

        [JsonProperty("ResidentialAddressPostcode")]
        public string ResidentialAddressPostcode { get; set; }

        [JsonProperty("OwnerTenant")]
        public string OwnerTenant { get; set; }

        [JsonProperty("PostalAddress1")]
        public string PostalAddress1 { get; set; }

        [JsonProperty("PostalAddress2")]
        public string PostalAddress2 { get; set; }

        [JsonProperty("PostalAddress3")]
        public string PostalAddress3 { get; set; }

        [JsonProperty("PostalAddress4")]
        public string PostalAddress4 { get; set; }

        [JsonProperty("PostalAddressPostCode")]
        public string PostalAddressPostCode { get; set; }

        [JsonProperty("OwnershipType")]
        public string OwnershipType { get; set; }

        [JsonProperty("LoanReasonCode")]
        public string LoanReasonCode { get; set; }

        [JsonProperty("PaymentType")]
        public string PaymentType { get; set; }

        [JsonProperty("TypeOfAccount")]
        public string TypeOfAccount { get; set; }

        [JsonProperty("DateAccountOpened")]
        [JsonConverter(typeof(ParseStringConverter))]
        public long DateAccountOpened { get; set; }

        [JsonProperty("DeferredPaymentDate")]
        public string DeferredPaymentDate { get; set; }

        [JsonProperty("DateOfLastPayment")]
        [JsonConverter(typeof(ParseStringConverter))]
        public long DateOfLastPayment { get; set; }

        [JsonProperty("OpeningBalanceCreditLimit")]
        public long OpeningBalanceCreditLimit { get; set; }

        [JsonProperty("CurrentBalance")]
        public long CurrentBalance { get; set; }

        [JsonProperty("CurrentBalanceIndicator")]
        public CurrentBalanceIndicator CurrentBalanceIndicator { get; set; }

        [JsonProperty("AmountOverdue")]
        public long AmountOverdue { get; set; }

        [JsonProperty("InstallmentAmount")]
        public long InstallmentAmount { get; set; }

        [JsonProperty("MonthsInArrears")]
        public long MonthsInArrears { get; set; }

        [JsonProperty("StatusCode")]
        public StatusCode StatusCode { get; set; }

        [JsonProperty("RepaymentFrequency")]
        public string RepaymentFrequency { get; set; }

        [JsonProperty("RepaymentFrequencyDescription")]
        public string RepaymentFrequencyDescription { get; set; }

        [JsonProperty("Terms")]
        public string Terms { get; set; }

        [JsonProperty("StatusDate")]
        public string StatusDate { get; set; }

        [JsonProperty("OldSupplierBranchCode")]
        public string OldSupplierBranchCode { get; set; }

        [JsonProperty("OldSupplierAccountNumber")]
        public string OldSupplierAccountNumber { get; set; }

        [JsonProperty("OldSupplierSubaccountNumber")]
        public string OldSupplierSubaccountNumber { get; set; }

        [JsonProperty("OldSupplierReferenceNumber")]
        public string OldSupplierReferenceNumber { get; set; }

        [JsonProperty("HomeTelephoneNumber")]
        public string HomeTelephoneNumber { get; set; }

        [JsonProperty("CellphoneNumber")]
        public string CellphoneNumber { get; set; }

        [JsonProperty("WorkTelephoneNumber")]
        public string WorkTelephoneNumber { get; set; }

        [JsonProperty("EmployerName")]
        public string EmployerName { get; set; }

        [JsonProperty("Income")]
        public long Income { get; set; }

        [JsonProperty("IncomeFrequency")]
        public string IncomeFrequency { get; set; }

        [JsonProperty("Occupation")]
        public string Occupation { get; set; }

        [JsonProperty("ThirdPartyName")]
        public string ThirdPartyName { get; set; }

        [JsonProperty("AccountSoldToThirdParty")]
        public string AccountSoldToThirdParty { get; set; }

        [JsonProperty("NumberOfParticipantsInJointLoan")]
        public string NumberOfParticipantsInJointLoan { get; set; }

        [JsonProperty("MonthEndDate")]
        [JsonConverter(typeof(ParseStringConverter))]
        public long MonthEndDate { get; set; }

        [JsonProperty("MonthEndPeriod")]
        [JsonConverter(typeof(ParseStringConverter))]
        public long MonthEndPeriod { get; set; }

        [JsonProperty("SupplierReferenceNumber")]
        public string SupplierReferenceNumber { get; set; }

        [JsonProperty("IsLatestRecord")]
        public bool IsLatestRecord { get; set; }

        [JsonProperty("CreditProvider")]
        public string CreditProvider { get; set; }

        [JsonProperty("AccountType")]
        public string AccountType { get; set; }

        [JsonProperty("StatusDescription")]
        public string StatusDescription { get; set; }

        [JsonProperty("AccountStatus")]
        public string AccountStatus { get; set; }

        [JsonProperty("PaymentStatus")]
        public string PaymentStatus { get; set; }

        [JsonProperty("PPString")]
        public PpString[] PpString { get; set; }

        [JsonProperty("LoadDate")]
        [JsonConverter(typeof(ParseStringConverter))]
        public long LoadDate { get; set; }

        [JsonProperty("HasDispute")]
        public bool HasDispute { get; set; }

        [JsonProperty("HasWriteOff")]
        public bool HasWriteOff { get; set; }

        [JsonProperty("HasFacilityRevoked")]
        public bool HasFacilityRevoked { get; set; }

        [JsonProperty("HasJudgment")]
        public bool HasJudgment { get; set; }

        [JsonProperty("HasHandover")]
        public bool HasHandover { get; set; }

        [JsonProperty("HasLapsedPolicy")]
        public bool HasLapsedPolicy { get; set; }

        [JsonProperty("HasRepossession")]
        public bool HasRepossession { get; set; }

        [JsonProperty("HasAdverse")]
        public bool HasAdverse { get; set; }

        [JsonProperty("SourceType")]
        public string SourceType { get; set; }

        [JsonProperty("Source")]
        public Source Source { get; set; }
    }

    public partial class PpString
    {
        [JsonProperty("Period")]
        public long Period { get; set; }

        [JsonProperty("MonthEndPeriod")]
        [JsonConverter(typeof(ParseStringConverter))]
        public long MonthEndPeriod { get; set; }

        [JsonProperty("DisplayPeriod")]
        public string DisplayPeriod { get; set; }

        [JsonProperty("MIA")]
        public long Mia { get; set; }

        [JsonProperty("StatusCode")]
        public StatusCode StatusCode { get; set; }

        [JsonProperty("Balance")]
        public long Balance { get; set; }

        [JsonProperty("CurrentBalanceIndicator")]
        public CurrentBalanceIndicator CurrentBalanceIndicator { get; set; }

        [JsonProperty("Installment")]
        public long Installment { get; set; }

        [JsonProperty("Arrears")]
        public long Arrears { get; set; }

        [JsonProperty("StatusDate")]
        public string StatusDate { get; set; }

        [JsonProperty("InstallmentAmount", NullValueHandling = NullValueHandling.Ignore)]
        public long? InstallmentAmount { get; set; }

        [JsonProperty("CurrentBalance", NullValueHandling = NullValueHandling.Ignore)]
        public long? CurrentBalance { get; set; }

        [JsonProperty("AmountOverdue", NullValueHandling = NullValueHandling.Ignore)]
        public long? AmountOverdue { get; set; }

        [JsonProperty("MonthsInArrears", NullValueHandling = NullValueHandling.Ignore)]
        public long? MonthsInArrears { get; set; }
    }

    public partial class PpSummaryElement
    {
        [JsonProperty("MonthEndPeriod")]
        public string MonthEndPeriod { get; set; }

        [JsonProperty("DisplayPeriod")]
        public string DisplayPeriod { get; set; }

        [JsonProperty("AccountType")]
        public string AccountType { get; set; }

        [JsonProperty("Balance")]
        public long Balance { get; set; }

        [JsonProperty("Installment")]
        public long Installment { get; set; }

        [JsonProperty("Arrears")]
        public long Arrears { get; set; }

        [JsonProperty("ProportionalBalance")]
        public double ProportionalBalance { get; set; }

        [JsonProperty("ProportionalInstallment")]
        public long ProportionalInstallment { get; set; }

        [JsonProperty("ProportionalArrears")]
        public long ProportionalArrears { get; set; }

        [JsonProperty("Accounts")]
        public long Accounts { get; set; }

        [JsonProperty("AccountsGoodStanding")]
        public long AccountsGoodStanding { get; set; }

        [JsonProperty("AccountsAdverse")]
        public long AccountsAdverse { get; set; }

        [JsonProperty("AccountsAdverseStatusCodes")]
        public long AccountsAdverseStatusCodes { get; set; }

        [JsonProperty("MaxMIA")]
        public long MaxMia { get; set; }

        [JsonProperty("DateOfLastPayment")]
        [JsonConverter(typeof(ParseStringConverter))]
        public long DateOfLastPayment { get; set; }

        [JsonProperty("LastAccountOpenedDate")]
        [JsonConverter(typeof(ParseStringConverter))]
        public long LastAccountOpenedDate { get; set; }

        [JsonProperty("StrikeDate_EarlyMonth")]
        public long StrikeDateEarlyMonth { get; set; }

        [JsonProperty("StrikeDate_EndOfMonth")]
        public long StrikeDateEndOfMonth { get; set; }

        [JsonProperty("StrikeDate_EarlyMidMonth")]
        public long StrikeDateEarlyMidMonth { get; set; }

        [JsonProperty("StrikeDate_LateMidMonth")]
        public long StrikeDateLateMidMonth { get; set; }

        [JsonProperty("StrikeDate")]
        [JsonConverter(typeof(ParseStringConverter))]
        public long StrikeDate { get; set; }
    }

    public partial class CreditReportResponseDtoPpSummary
    {
        [JsonProperty("PPSummary")]
        public PpSummaryElement[] PpSummary { get; set; }
    }

    public partial class Properties
    {
        [JsonProperty("DeedsRecords")]
        public DeedsRecord[] DeedsRecords { get; set; }

        [JsonProperty("TotalRecords")]
        public long TotalRecords { get; set; }

        [JsonProperty("TotalValue")]
        public long TotalValue { get; set; }

        [JsonProperty("TotalReturnedRecords")]
        public long TotalReturnedRecords { get; set; }
    }

    public partial class DeedsRecord
    {
        [JsonProperty("OwnerIDRegTrustNumber")]
        public string OwnerIdRegTrustNumber { get; set; }

        [JsonProperty("BuyerName")]
        public string BuyerName { get; set; }

        [JsonProperty("BuyerIDNumber")]
        public string BuyerIdNumber { get; set; }

        [JsonProperty("SellerIDNumber")]
        public string SellerIdNumber { get; set; }

        [JsonProperty("PropertyDeedID")]
        public long PropertyDeedId { get; set; }

        [JsonProperty("SchemeName")]
        public string SchemeName { get; set; }

        [JsonProperty("BuildingLine")]
        public string BuildingLine { get; set; }

        [JsonProperty("UnitNumber")]
        [JsonConverter(typeof(ParseStringConverter))]
        public long UnitNumber { get; set; }

        [JsonProperty("StreetAddress")]
        public string StreetAddress { get; set; }

        [JsonProperty("StreetNumber")]
        public string StreetNumber { get; set; }

        [JsonProperty("StreetName")]
        public string StreetName { get; set; }

        [JsonProperty("StreetType")]
        public string StreetType { get; set; }

        [JsonProperty("Suburb")]
        public string Suburb { get; set; }

        [JsonProperty("Town")]
        public string Town { get; set; }

        [JsonProperty("PostCode")]
        public string PostCode { get; set; }

        [JsonProperty("Authority")]
        public string Authority { get; set; }

        [JsonProperty("MunicipalityName")]
        public string MunicipalityName { get; set; }

        [JsonProperty("Registrar")]
        public string Registrar { get; set; }

        [JsonProperty("PurchaseDate")]
        public DateTimeOffset PurchaseDate { get; set; }

        [JsonProperty("YearsSincePurchase")]
        public long YearsSincePurchase { get; set; }

        [JsonProperty("PurchaseAmount")]
        [JsonConverter(typeof(ParseStringConverter))]
        public long PurchaseAmount { get; set; }

        [JsonProperty("EstimatedMarketValue")]
        public double EstimatedMarketValue { get; set; }

        [JsonProperty("TitleDeedNumber")]
        public string TitleDeedNumber { get; set; }

        [JsonProperty("TitleDeedFee")]
        public string TitleDeedFee { get; set; }

        [JsonProperty("OldTitleDeedNumber")]
        public string OldTitleDeedNumber { get; set; }

        [JsonProperty("ProvinceCode")]
        public string ProvinceCode { get; set; }

        [JsonProperty("RegistrationDate")]
        public DateTimeOffset RegistrationDate { get; set; }

        [JsonProperty("SellerName")]
        public string SellerName { get; set; }

        [JsonProperty("IsCurrentOwnerFlag")]
        public string IsCurrentOwnerFlag { get; set; }

        [JsonProperty("IsCurrentOwner")]
        public string IsCurrentOwner { get; set; }

        [JsonProperty("PropertySoldNewTitleDeed")]
        public string PropertySoldNewTitleDeed { get; set; }

        [JsonProperty("BondNumber")]
        public string BondNumber { get; set; }

        [JsonProperty("BondHolder")]
        public string BondHolder { get; set; }

        [JsonProperty("BondAmount")]
        public long BondAmount { get; set; }

        [JsonProperty("PropertyType")]
        public string PropertyType { get; set; }

        [JsonProperty("PropertyName")]
        public string PropertyName { get; set; }

        [JsonProperty("ErfSize")]
        public string ErfSize { get; set; }

        [JsonProperty("Extent")]
        public string Extent { get; set; }

        [JsonProperty("StandNumber")]
        [JsonConverter(typeof(ParseStringConverter))]
        public long StandNumber { get; set; }

        [JsonProperty("Share")]
        public string Share { get; set; }

        [JsonProperty("BuyerStatus")]
        public string BuyerStatus { get; set; }

        [JsonProperty("RecordDate")]
        public DateTimeOffset RecordDate { get; set; }

        [JsonProperty("Source")]
        public string Source { get; set; }

        [JsonProperty("Reference")]
        public string Reference { get; set; }

        [JsonProperty("PartialIDMatch")]
        public bool PartialIdMatch { get; set; }

        [JsonProperty("Lat")]
        public long Lat { get; set; }

        [JsonProperty("Lon")]
        public long Lon { get; set; }

        [JsonProperty("PortionNumber")]
        [JsonConverter(typeof(ParseStringConverter))]
        public long PortionNumber { get; set; }
    }

    public partial class PropertySummary
    {
        [JsonProperty("PropertyCount")]
        [JsonConverter(typeof(ParseStringConverter))]
        public long PropertyCount { get; set; }

        [JsonProperty("PropertyMaxValue")]
        [JsonConverter(typeof(ParseStringConverter))]
        public long PropertyMaxValue { get; set; }

        [JsonProperty("PropertyTotalValue")]
        [JsonConverter(typeof(ParseStringConverter))]
        public long PropertyTotalValue { get; set; }
    }

    public partial class SafpprDetail
    {
        [JsonProperty("SAFPSProtectives")]
        public object[] SafpsProtectives { get; set; }

        [JsonProperty("TotalRecords")]
        public long TotalRecords { get; set; }

        [JsonProperty("TotalReturnedRecords")]
        public long TotalReturnedRecords { get; set; }
    }

    public partial class SafpsDetail
    {
        [JsonProperty("SAFPSs")]
        public object[] SafpSs { get; set; }

        [JsonProperty("TotalRecords")]
        public long TotalRecords { get; set; }

        [JsonProperty("TotalReturnedRecords")]
        public long TotalReturnedRecords { get; set; }
    }

    public partial class Telephones
    {
        [JsonProperty("Telephones")]
        public Telephone[] TelephonesTelephones { get; set; }

        [JsonProperty("BusinessTelephones")]
        public object[] BusinessTelephones { get; set; }

        [JsonProperty("TotalRecords")]
        public long TotalRecords { get; set; }

        [JsonProperty("TotalReturnedRecords")]
        public long TotalReturnedRecords { get; set; }
    }

    public partial class Telephone
    {
        [JsonProperty("IDNumber")]
        public string IdNumber { get; set; }

        [JsonProperty("IDNumberTen")]
        public string IdNumberTen { get; set; }

        [JsonProperty("Passport")]
        public string Passport { get; set; }

        [JsonProperty("TelNumber")]
        public string TelNumber { get; set; }

        [JsonProperty("TelType")]
        public string TelType { get; set; }

        [JsonProperty("FirstDate")]
        public DateTimeOffset FirstDate { get; set; }

        [JsonProperty("LatestDate")]
        public DateTimeOffset LatestDate { get; set; }

        [JsonProperty("FirstStatus")]
        public FirstStatus FirstStatus { get; set; }

        [JsonProperty("LatestStatus")]
        public FirstStatus LatestStatus { get; set; }

        [JsonProperty("Score")]
        public long Score { get; set; }

        [JsonProperty("IsDiallable")]
        public string IsDiallable { get; set; }

        [JsonProperty("IsValid")]
        public string IsValid { get; set; }

        [JsonProperty("Links")]
        [JsonConverter(typeof(ParseStringConverter))]
        public long Links { get; set; }

        [JsonProperty("BusinessName")]
        public string BusinessName { get; set; }

        [JsonProperty("Region")]
        public string Region { get; set; }

        [JsonProperty("Network")]
        public string Network { get; set; }

        [JsonProperty("Source")]
        public string[] Source { get; set; }

        [JsonProperty("KYCSource")]
        public object[] KycSource { get; set; }

        [JsonProperty("Reference")]
        public string Reference { get; set; }

        [JsonProperty("Surname")]
        public string Surname { get; set; }

        [JsonProperty("FirstNames")]
        public string FirstNames { get; set; }

        [JsonProperty("Occurrences")]
        public long Occurrences { get; set; }
    }

    public partial class TraceLocators
    {
        [JsonProperty("TraceLocator")]
        public object[] TraceLocator { get; set; }

        [JsonProperty("TotalRecords")]
        public long TotalRecords { get; set; }

        [JsonProperty("TotalReturnedRecords")]
        public long TotalReturnedRecords { get; set; }
    }

    public enum Source { Bureau, Cipc, Dha, Sacrra };

    public enum Country { SouthAfrica };

    public enum FirstStatus { ConfirmedCorrect, Unknown };

    public enum StreetLine { The5EvertonRoad, The64LinkRoad, The7Sanmarco };

    public enum Town { Durban, DurbanNorth, Empty, Pinetown };

    public enum CurrentBalanceIndicator { D };

    public enum StatusCode { Empty, P };

    public partial struct AddressId
    {
        public long? Integer;
        public string String;

        public static implicit operator AddressId(long Integer) => new AddressId { Integer = Integer };
        public static implicit operator AddressId(string String) => new AddressId { String = String };
    }

    public partial class CreditReportResponseDto
    {
        public static CreditReportResponseDto FromJson(string json) => JsonConvert.DeserializeObject<CreditReportResponseDto>(json, Converter.Settings);
    }

    public static class Serialize
    {
        public static string ToJson(this CreditReportResponseDto self) => JsonConvert.SerializeObject(self, Converter.Settings);
    }

    internal static class Converter
    {
        public static readonly JsonSerializerSettings Settings = new JsonSerializerSettings
        {
            MetadataPropertyHandling = MetadataPropertyHandling.Ignore,
            DateParseHandling = DateParseHandling.None,
            Converters =
            {
                SourceConverter.Singleton,
                CountryConverter.Singleton,
                AddressIdConverter.Singleton,
                FirstStatusConverter.Singleton,
                StreetLineConverter.Singleton,
                TownConverter.Singleton,
                CurrentBalanceIndicatorConverter.Singleton,
                StatusCodeConverter.Singleton,
                new IsoDateTimeConverter { DateTimeStyles = DateTimeStyles.AssumeUniversal }
            },
        };
    }

    internal class SourceConverter : JsonConverter
    {
        public override bool CanConvert(Type t) => t == typeof(Source) || t == typeof(Source?);

        public override object ReadJson(JsonReader reader, Type t, object existingValue, JsonSerializer serializer)
        {
            if (reader.TokenType == JsonToken.Null) return null;
            var value = serializer.Deserialize<string>(reader);
            switch (value)
            {
                case "Bureau":
                    return Source.Bureau;
                case "CIPC":
                    return Source.Cipc;
                case "DHA":
                    return Source.Dha;
                case "SACRRA":
                    return Source.Sacrra;
            }
            throw new Exception("Cannot unmarshal type Source");
        }

        public override void WriteJson(JsonWriter writer, object untypedValue, JsonSerializer serializer)
        {
            if (untypedValue == null)
            {
                serializer.Serialize(writer, null);
                return;
            }
            var value = (Source)untypedValue;
            switch (value)
            {
                case Source.Bureau:
                    serializer.Serialize(writer, "Bureau");
                    return;
                case Source.Cipc:
                    serializer.Serialize(writer, "CIPC");
                    return;
                case Source.Dha:
                    serializer.Serialize(writer, "DHA");
                    return;
                case Source.Sacrra:
                    serializer.Serialize(writer, "SACRRA");
                    return;
            }
            throw new Exception("Cannot marshal type Source");
        }

        public static readonly SourceConverter Singleton = new SourceConverter();
    }

    internal class CountryConverter : JsonConverter
    {
        public override bool CanConvert(Type t) => t == typeof(Country) || t == typeof(Country?);

        public override object ReadJson(JsonReader reader, Type t, object existingValue, JsonSerializer serializer)
        {
            if (reader.TokenType == JsonToken.Null) return null;
            var value = serializer.Deserialize<string>(reader);
            if (value == "South Africa")
            {
                return Country.SouthAfrica;
            }
            throw new Exception("Cannot unmarshal type Country");
        }

        public override void WriteJson(JsonWriter writer, object untypedValue, JsonSerializer serializer)
        {
            if (untypedValue == null)
            {
                serializer.Serialize(writer, null);
                return;
            }
            var value = (Country)untypedValue;
            if (value == Country.SouthAfrica)
            {
                serializer.Serialize(writer, "South Africa");
                return;
            }
            throw new Exception("Cannot marshal type Country");
        }

        public static readonly CountryConverter Singleton = new CountryConverter();
    }

    internal class AddressIdConverter : JsonConverter
    {
        public override bool CanConvert(Type t) => t == typeof(AddressId) || t == typeof(AddressId?);

        public override object ReadJson(JsonReader reader, Type t, object existingValue, JsonSerializer serializer)
        {
            switch (reader.TokenType)
            {
                case JsonToken.Integer:
                    var integerValue = serializer.Deserialize<long>(reader);
                    return new AddressId { Integer = integerValue };
                case JsonToken.String:
                case JsonToken.Date:
                    var stringValue = serializer.Deserialize<string>(reader);
                    return new AddressId { String = stringValue };
            }
            throw new Exception("Cannot unmarshal type AddressId");
        }

        public override void WriteJson(JsonWriter writer, object untypedValue, JsonSerializer serializer)
        {
            var value = (AddressId)untypedValue;
            if (value.Integer != null)
            {
                serializer.Serialize(writer, value.Integer.Value);
                return;
            }
            if (value.String != null)
            {
                serializer.Serialize(writer, value.String);
                return;
            }
            throw new Exception("Cannot marshal type AddressId");
        }

        public static readonly AddressIdConverter Singleton = new AddressIdConverter();
    }

    internal class FirstStatusConverter : JsonConverter
    {
        public override bool CanConvert(Type t) => t == typeof(FirstStatus) || t == typeof(FirstStatus?);

        public override object ReadJson(JsonReader reader, Type t, object existingValue, JsonSerializer serializer)
        {
            if (reader.TokenType == JsonToken.Null) return null;
            var value = serializer.Deserialize<string>(reader);
            switch (value)
            {
                case "Confirmed Correct":
                    return FirstStatus.ConfirmedCorrect;
                case "Unknown":
                    return FirstStatus.Unknown;
            }
            throw new Exception("Cannot unmarshal type FirstStatus");
        }

        public override void WriteJson(JsonWriter writer, object untypedValue, JsonSerializer serializer)
        {
            if (untypedValue == null)
            {
                serializer.Serialize(writer, null);
                return;
            }
            var value = (FirstStatus)untypedValue;
            switch (value)
            {
                case FirstStatus.ConfirmedCorrect:
                    serializer.Serialize(writer, "Confirmed Correct");
                    return;
                case FirstStatus.Unknown:
                    serializer.Serialize(writer, "Unknown");
                    return;
            }
            throw new Exception("Cannot marshal type FirstStatus");
        }

        public static readonly FirstStatusConverter Singleton = new FirstStatusConverter();
    }

    internal class StreetLineConverter : JsonConverter
    {
        public override bool CanConvert(Type t) => t == typeof(StreetLine) || t == typeof(StreetLine?);

        public override object ReadJson(JsonReader reader, Type t, object existingValue, JsonSerializer serializer)
        {
            if (reader.TokenType == JsonToken.Null) return null;
            var value = serializer.Deserialize<string>(reader);
            switch (value)
            {
                case "5 EVERTON ROAD":
                    return StreetLine.The5EvertonRoad;
                case "64 LINK ROAD":
                    return StreetLine.The64LinkRoad;
                case "7 SANMARCO":
                    return StreetLine.The7Sanmarco;
            }
            throw new Exception("Cannot unmarshal type StreetLine");
        }

        public override void WriteJson(JsonWriter writer, object untypedValue, JsonSerializer serializer)
        {
            if (untypedValue == null)
            {
                serializer.Serialize(writer, null);
                return;
            }
            var value = (StreetLine)untypedValue;
            switch (value)
            {
                case StreetLine.The5EvertonRoad:
                    serializer.Serialize(writer, "5 EVERTON ROAD");
                    return;
                case StreetLine.The64LinkRoad:
                    serializer.Serialize(writer, "64 LINK ROAD");
                    return;
                case StreetLine.The7Sanmarco:
                    serializer.Serialize(writer, "7 SANMARCO");
                    return;
            }
            throw new Exception("Cannot marshal type StreetLine");
        }

        public static readonly StreetLineConverter Singleton = new StreetLineConverter();
    }

    internal class TownConverter : JsonConverter
    {
        public override bool CanConvert(Type t) => t == typeof(Town) || t == typeof(Town?);

        public override object ReadJson(JsonReader reader, Type t, object existingValue, JsonSerializer serializer)
        {
            if (reader.TokenType == JsonToken.Null) return null;
            var value = serializer.Deserialize<string>(reader);
            switch (value)
            {
                case "":
                    return Town.Empty;
                case "DURBAN":
                    return Town.Durban;
                case "DURBAN NORTH":
                    return Town.DurbanNorth;
                case "PINETOWN":
                    return Town.Pinetown;
            }
            throw new Exception("Cannot unmarshal type Town");
        }

        public override void WriteJson(JsonWriter writer, object untypedValue, JsonSerializer serializer)
        {
            if (untypedValue == null)
            {
                serializer.Serialize(writer, null);
                return;
            }
            var value = (Town)untypedValue;
            switch (value)
            {
                case Town.Empty:
                    serializer.Serialize(writer, "");
                    return;
                case Town.Durban:
                    serializer.Serialize(writer, "DURBAN");
                    return;
                case Town.DurbanNorth:
                    serializer.Serialize(writer, "DURBAN NORTH");
                    return;
                case Town.Pinetown:
                    serializer.Serialize(writer, "PINETOWN");
                    return;
            }
            throw new Exception("Cannot marshal type Town");
        }

        public static readonly TownConverter Singleton = new TownConverter();
    }

    internal class ParseStringConverter : JsonConverter
    {
        public override bool CanConvert(Type t) => t == typeof(long) || t == typeof(long?);

        public override object ReadJson(JsonReader reader, Type t, object existingValue, JsonSerializer serializer)
        {
            if (reader.TokenType == JsonToken.Null) return null;
            var value = serializer.Deserialize<string>(reader);
            long l;
            if (Int64.TryParse(value, out l))
            {
                return l;
            }
            throw new Exception("Cannot unmarshal type long");
        }

        public override void WriteJson(JsonWriter writer, object untypedValue, JsonSerializer serializer)
        {
            if (untypedValue == null)
            {
                serializer.Serialize(writer, null);
                return;
            }
            var value = (long)untypedValue;
            serializer.Serialize(writer, value.ToString());
            return;
        }

        public static readonly ParseStringConverter Singleton = new ParseStringConverter();
    }

    internal class CurrentBalanceIndicatorConverter : JsonConverter
    {
        public override bool CanConvert(Type t) => t == typeof(CurrentBalanceIndicator) || t == typeof(CurrentBalanceIndicator?);

        public override object ReadJson(JsonReader reader, Type t, object existingValue, JsonSerializer serializer)
        {
            if (reader.TokenType == JsonToken.Null) return null;
            var value = serializer.Deserialize<string>(reader);
            if (value == "D")
            {
                return CurrentBalanceIndicator.D;
            }
            throw new Exception("Cannot unmarshal type CurrentBalanceIndicator");
        }

        public override void WriteJson(JsonWriter writer, object untypedValue, JsonSerializer serializer)
        {
            if (untypedValue == null)
            {
                serializer.Serialize(writer, null);
                return;
            }
            var value = (CurrentBalanceIndicator)untypedValue;
            if (value == CurrentBalanceIndicator.D)
            {
                serializer.Serialize(writer, "D");
                return;
            }
            throw new Exception("Cannot marshal type CurrentBalanceIndicator");
        }

        public static readonly CurrentBalanceIndicatorConverter Singleton = new CurrentBalanceIndicatorConverter();
    }

    internal class StatusCodeConverter : JsonConverter
    {
        public override bool CanConvert(Type t) => t == typeof(StatusCode) || t == typeof(StatusCode?);

        public override object ReadJson(JsonReader reader, Type t, object existingValue, JsonSerializer serializer)
        {
            if (reader.TokenType == JsonToken.Null) return null;
            var value = serializer.Deserialize<string>(reader);
            switch (value)
            {
                case "":
                    return StatusCode.Empty;
                case "P":
                    return StatusCode.P;
            }
            throw new Exception("Cannot unmarshal type StatusCode");
        }

        public override void WriteJson(JsonWriter writer, object untypedValue, JsonSerializer serializer)
        {
            if (untypedValue == null)
            {
                serializer.Serialize(writer, null);
                return;
            }
            var value = (StatusCode)untypedValue;
            switch (value)
            {
                case StatusCode.Empty:
                    serializer.Serialize(writer, "");
                    return;
                case StatusCode.P:
                    serializer.Serialize(writer, "P");
                    return;
            }
            throw new Exception("Cannot marshal type StatusCode");
        }

        public static readonly StatusCodeConverter Singleton = new StatusCodeConverter();
    }
}
