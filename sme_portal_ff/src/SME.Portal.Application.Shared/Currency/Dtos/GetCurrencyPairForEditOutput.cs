using System;
using Abp.Application.Services.Dto;
using System.ComponentModel.DataAnnotations;

namespace SME.Portal.Currency.Dtos
{
    public class GetCurrencyPairForEditOutput
    {
		public CreateOrEditCurrencyPairDto CurrencyPair { get; set; }


    }
}