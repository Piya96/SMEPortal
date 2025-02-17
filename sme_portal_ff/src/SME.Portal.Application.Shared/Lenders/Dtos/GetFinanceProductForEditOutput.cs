using System;
using Abp.Application.Services.Dto;
using System.ComponentModel.DataAnnotations;

namespace SME.Portal.Lenders.Dtos
{
    public class GetFinanceProductForEditOutput
    {
        public CreateOrEditFinanceProductDto FinanceProduct { get; set; }

        public string LenderName { get; set; }

        public string CurrencyPairName { get; set; }

    }
}