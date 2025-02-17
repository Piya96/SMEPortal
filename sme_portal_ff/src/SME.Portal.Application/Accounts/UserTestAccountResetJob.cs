using Abp.Dependency;
using Abp.Domain.Repositories;
using Abp.Domain.Uow;
using Abp.Threading;
using Abp.Threading.BackgroundWorkers;
using Abp.Threading.Timers;
using Microsoft.AspNetCore.Hosting;
using SME.Portal.Accounts.UserTestAccountRestJobLogic;
using SME.Portal.Authorization.Users;
using SME.Portal.Company;
using SME.Portal.Company.Dtos;
using SME.Portal.ConsumerCredit;
using SME.Portal.Documents;
using SME.Portal.Documents.Dtos;
using SME.Portal.Lenders;
using SME.Portal.Sme.Subscriptions.Dtos;
using SME.Portal.SME;
using SME.Portal.SME.Subscriptions;
using System;
using System.Collections.Generic;
using System.Linq;

namespace SME.Portal.Accounts
{
    public partial class UserTestAccountResetJob : PeriodicBackgroundWorkerBase, ISingletonDependency
    {
        private readonly IShallowReset _shallowReset;
        private readonly IPartialReset _partialReset;
        private readonly IFullReset _fullReset;

        private readonly int[] _tenantIds;

        public UserTestAccountResetJob(
            AbpTimer timer,
            IShallowReset shallowReset,
            IPartialReset partialReset,
            IFullReset fullReset)
            : base(timer)
        {
            // triggers every 1 hours
            Timer.Period = 3600000;   

            //Timer.Period = 60000;

            _shallowReset = shallowReset;
            _partialReset = partialReset;
            _fullReset = fullReset;
            _tenantIds = new[] { 2, 3 };
        }

        [UnitOfWork]
        protected override void DoWork()
        {
            var now = DateTime.Now;

            Logger.Debug($"UserTestAccountResetJob triggered at: {now}");

            foreach (var tenantId in _tenantIds)
            {
                using (UnitOfWorkManager.Current.SetTenantId(tenantId))
                {
                    try
                    {
                        if (now.Hour == 23)
                        {
                            _shallowReset.PerformReset(tenantId);
                            _partialReset.PerformReset(tenantId);
                            _fullReset.PerformReset(tenantId);

                            CurrentUnitOfWork.SaveChanges();
                        }
                    }
                    catch (Exception x)
                    {
                        Logger.Error($"Exception: {x.Message} {Environment.NewLine} Failed call to UserTestAccountResetJob");
                        throw x;
                    }

                }
            }
        }
    }
}
