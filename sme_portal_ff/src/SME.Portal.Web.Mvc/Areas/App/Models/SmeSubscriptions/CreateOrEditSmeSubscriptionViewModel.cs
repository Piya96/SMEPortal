using SME.Portal.Sme.Subscriptions.Dtos;

using Abp.Extensions;

namespace SME.Portal.Web.Areas.App.Models.SmeSubscriptions
{
    public class CreateOrEditSmeSubscriptionModalViewModel
    {
        public CreateOrEditSmeSubscriptionDto SmeSubscription { get; set; }

        public bool IsEditMode => SmeSubscription.Id.HasValue;
    }
}