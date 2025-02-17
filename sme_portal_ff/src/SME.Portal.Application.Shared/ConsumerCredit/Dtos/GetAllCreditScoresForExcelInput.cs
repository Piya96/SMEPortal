using Abp.Application.Services.Dto;
using System;

namespace SME.Portal.ConsumerCredit.Dtos
{
    public class GetAllCreditScoresForExcelInput
    {
        public string Filter { get; set; }

        public int? MaxScoreFilter { get; set; }
        public int? MinScoreFilter { get; set; }

        public DateTime? MaxEnquiryDateFilter { get; set; }
        public DateTime? MinEnquiryDateFilter { get; set; }

        public string UserNameFilter { get; set; }

    }
}