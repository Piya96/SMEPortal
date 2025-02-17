using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SME.Portal.Lenders.Old
{
    [Table("CurrencyPair")]
	public class CurrencyPair
	{
		[Key]
		public virtual Guid Id { get; set; }

		[Required]
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
