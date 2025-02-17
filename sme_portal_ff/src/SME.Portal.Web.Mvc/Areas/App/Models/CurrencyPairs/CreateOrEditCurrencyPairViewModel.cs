using SME.Portal.Currency.Dtos;

using Abp.Extensions;

namespace SME.Portal.Web.Areas.App.Models.CurrencyPairs
{
    public class CreateOrEditCurrencyPairModalViewModel
    {
       public CreateOrEditCurrencyPairDto CurrencyPair { get; set; }

	   
       
	   public bool IsEditMode => CurrencyPair.Id.HasValue;
    }
}