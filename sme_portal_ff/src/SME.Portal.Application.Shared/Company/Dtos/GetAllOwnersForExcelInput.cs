using Abp.Application.Services.Dto;
using System;

namespace SME.Portal.Company.Dtos
{
    public class GetAllOwnersForExcelInput
    {
        public string Filter { get; set; }

        public string NameFilter { get; set; }

        public string SurnameFilter { get; set; }

        public string EmailAddressFilter { get; set; }

        public string PhoneNumberFilter { get; set; }

        public int? IsPhoneNumberConfirmedFilter { get; set; }

        public string IdentityOrPassportFilter { get; set; }

        public int? IsIdentityOrPassportConfirmedFilter { get; set; }

        public string RaceFilter { get; set; }

        public string VerificationRecordJsonFilter { get; set; }

        public string UserNameFilter { get; set; }

    }
}