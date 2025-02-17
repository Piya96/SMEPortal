using SME.Portal.Lenders.Dtos;

using Abp.Extensions;

namespace SME.Portal.Web.Areas.App.Models.FinanceProducts
{
    public class CreateOrEditFinanceProductModalViewModel
    {
        public CreateOrEditFinanceProductDto FinanceProduct { get; set; }

        public string LenderName { get; set; }

        public string CurrencyPairName { get; set; }

        public bool IsEditMode => FinanceProduct.Id.HasValue;
    }
}