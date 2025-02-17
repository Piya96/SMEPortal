using SME.Portal.Lenders.Dtos;

using Abp.Extensions;

namespace SME.Portal.Web.Areas.App.Models.Contracts
{
    public class CreateOrEditContractModalViewModel
    {
       public CreateOrEditContractDto Contract { get; set; }

	   		public string LenderName { get; set;}

		public string UserName { get; set;}


       
	   public bool IsEditMode => Contract.Id.HasValue;
    }
}