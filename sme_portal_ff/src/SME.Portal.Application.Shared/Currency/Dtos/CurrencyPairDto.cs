
using System;
using Abp.Application.Services.Dto;

namespace SME.Portal.Currency.Dtos
{
    public class CurrencyPairDto : EntityDto
    {
		public string Name { get; set; }

		public string BaseCurrencyCode { get; set; }

		public string TargetCurrencyCode { get; set; }

		public decimal ExchangeRate { get; set; }

		public string Symbol { get; set; }

		public string Log { get; set; }



    }
}