using System;
using Abp.Application.Services.Dto;
using System.ComponentModel.DataAnnotations;

namespace SME.Portal.Lenders.Dtos
{
    public class GetContractForEditOutput
    {
		public CreateOrEditContractDto Contract { get; set; }

		public string LenderName { get; set;}

		public string UserName { get; set;}


    }
}