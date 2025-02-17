using PayFast.ApiTypes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SME.Portal.Web.Areas.App.Models.SmeSubscription
{
    public class SubscriptionCancelledViewModel
    {
        public UpdateResponse _updateResponse { get; set; }
        public SubscriptionCancelledViewModel(UpdateResponse updateResponse)
        {
            _updateResponse = updateResponse;
        }
    }
}
