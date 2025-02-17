using Abp.Threading;
using SME.Portal.ConsumerCredit;
using System;
using System.Collections.Generic;
using System.Text;

namespace SME.Portal.Accounts.UserTestAccountRestJobLogic
{
    public class CreditReportAndCreditScoreResetJob
    {
        private readonly ICreditReportsAppService _creditReportsAppService;
        private readonly ICreditScoresAppService _creditScoresAppService;

        public CreditReportAndCreditScoreResetJob(
            ICreditReportsAppService creditReportsAppService,
            ICreditScoresAppService creditScoresAppService)
        {
            _creditReportsAppService = creditReportsAppService;
            _creditScoresAppService = creditScoresAppService;
        }

        public CreditReportAndCreditScoreResetJob DeleteCreditReportsAndCreditScores(long userId)
        {

            AsyncHelper.RunSync(() => _creditReportsAppService.DeleteForUser(userId));
            AsyncHelper.RunSync(() => _creditScoresAppService.DeleteForUser(userId));
            return this;
        }
    }
}
