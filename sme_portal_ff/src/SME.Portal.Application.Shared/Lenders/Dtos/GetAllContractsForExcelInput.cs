using Abp.Application.Services.Dto;
using System;

namespace SME.Portal.Lenders.Dtos
{
    public class GetAllContractsForExcelInput
    {
		public string Filter { get; set; }

		public DateTime? MaxStartFilter { get; set; }
		public DateTime? MinStartFilter { get; set; }

		public DateTime? MaxExpiryFilter { get; set; }
		public DateTime? MinExpiryFilter { get; set; }

		public decimal? MaxCommissionFilter { get; set; }
		public decimal? MinCommissionFilter { get; set; }


		 public string LenderNameFilter { get; set; }

		 		 public string UserNameFilter { get; set; }

		 
    }
}