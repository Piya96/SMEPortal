using Abp.Application.Services.Dto;
using System;

namespace SME.Portal.Currency.Dtos
{
    public class GetAllCurrencyPairsForExcelInput
    {
		public string Filter { get; set; }

		public string NameFilter { get; set; }

		public string BaseCurrencyCodeFilter { get; set; }

		public string TargetCurrencyCodeFilter { get; set; }

		public decimal? MaxExchangeRateFilter { get; set; }
		public decimal? MinExchangeRateFilter { get; set; }

		public string SymbolFilter { get; set; }

		public string LogFilter { get; set; }



    }
}