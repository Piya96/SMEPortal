
using System;
using Abp.Application.Services.Dto;
using System.ComponentModel.DataAnnotations;

namespace SME.Portal.Currency.Dtos
{
    public class CreateOrEditCurrencyPairDto : EntityDto<int?>
    {

		[Required]
		[StringLength(CurrencyPairConsts.MaxNameLength, MinimumLength = CurrencyPairConsts.MinNameLength)]
		public string Name { get; set; }
		
		
		[Required]
		public string BaseCurrencyCode { get; set; }
		
		
		[Required]
		public string TargetCurrencyCode { get; set; }
		
		
		public decimal ExchangeRate { get; set; }
		
		
		[Required]
		public string Symbol { get; set; }
		
		
		public string Log { get; set; }
		
		

    }
}