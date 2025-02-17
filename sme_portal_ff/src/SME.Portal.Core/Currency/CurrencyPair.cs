using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities.Auditing;
using Abp.Domain.Entities;
using Abp.Auditing;

namespace SME.Portal.Currency
{
	[Table("CurrencyPairs")]
    [Audited]
    public class CurrencyPair : AuditedEntity 
    {

		[Required]
		[StringLength(CurrencyPairConsts.MaxNameLength, MinimumLength = CurrencyPairConsts.MinNameLength)]
		public virtual string Name { get; set; }
		
		[Required]
		public virtual string BaseCurrencyCode { get; set; }
		
		[Required]
		public virtual string TargetCurrencyCode { get; set; }
		
		public virtual decimal ExchangeRate { get; set; }
		
		[Required]
		public virtual string Symbol { get; set; }
		
		public virtual string Log { get; set; }
		

    }
}