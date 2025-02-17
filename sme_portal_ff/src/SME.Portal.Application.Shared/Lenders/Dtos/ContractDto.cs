
using System;
using Abp.Application.Services.Dto;

namespace SME.Portal.Lenders.Dtos
{
    public class ContractDto : EntityDto
    {
		public DateTime Start { get; set; }

		public DateTime Expiry { get; set; }

		public decimal Commission { get; set; }


		 public int LenderId { get; set; }

		 		 public long UserId { get; set; }

		 
    }
}