using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace DataManipulation.Entities
{
	[Table("CurrencyPairs")]
	public class CurrencyPair 
	{

		[Key]
		public virtual int Id { get; set; }


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
