using SME.Portal.ConsumerCredit.Dtos;

using Abp.Extensions;

namespace SME.Portal.Web.Areas.App.Models.CreditScores
{
    public class CreateOrEditCreditScoreModalViewModel
    {
        public CreateOrEditCreditScoreDto CreditScore { get; set; }

        public string UserName { get; set; }

        public bool IsEditMode => CreditScore.Id.HasValue;
    }
}