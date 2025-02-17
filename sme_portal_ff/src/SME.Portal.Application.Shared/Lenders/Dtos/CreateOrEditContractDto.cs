
using System;
using Abp.Application.Services.Dto;
using System.ComponentModel.DataAnnotations;

namespace SME.Portal.Lenders.Dtos
{
    public class CreateOrEditContractDto : EntityDto<int?>
    {

		public DateTime Start { get; set; }
		
		
		public DateTime Expiry { get; set; }
		
		
		public decimal Commission { get; set; }
		
		
		 public int LenderId { get; set; }
		 
		 		 public long UserId { get; set; }
		 
		 
    }
}