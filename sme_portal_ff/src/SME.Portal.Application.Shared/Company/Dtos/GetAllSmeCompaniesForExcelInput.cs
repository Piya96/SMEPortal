using Abp.Application.Services.Dto;
using System;

namespace SME.Portal.Company.Dtos
{
    public class GetAllSmeCompaniesForExcelInput
    {
        public string Filter { get; set; }

        public string NameFilter { get; set; }

        public string RegistrationNumberFilter { get; set; }

        public string TypeFilter { get; set; }

        public DateTime? MaxRegistrationDateFilter { get; set; }
        public DateTime? MinRegistrationDateFilter { get; set; }

        public DateTime? MaxStartedTradingDateFilter { get; set; }
        public DateTime? MinStartedTradingDateFilter { get; set; }

        public string RegisteredAddressFilter { get; set; }

        public string CustomersFilter { get; set; }

        public string PropertiesJsonFilter { get; set; }

        public string WebSiteFilter { get; set; }

        public string UserNameFilter { get; set; }

    }
}