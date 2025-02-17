using Abp.Application.Editions;
using Abp.Dependency;
using Abp.Domain.Repositories;
using Abp.Domain.Uow;
using Abp.Threading.BackgroundWorkers;
using Abp.Threading.Timers;
using SME.Portal.Sme.Subscriptions;
using System;
using System.Linq;

namespace SME.Portal.SME.Subscriptions
{
    public class SmeSubscriptionExpiryJob : PeriodicBackgroundWorkerBase, ISingletonDependency
    {
        private readonly IRepository<SmeSubscription, int> _smeSubscriptionRepository;
        private readonly IRepository<Edition, int> _editionRepository;

        public SmeSubscriptionExpiryJob(AbpTimer timer, IRepository<SmeSubscription, int> smeSubscriptionRepository, IRepository<Edition, int> editionRepository)
            : base(timer)
        {
            _smeSubscriptionRepository = smeSubscriptionRepository;
            _editionRepository = editionRepository;
            Timer.Period = 43200000;   //12 hours
            //Timer.Period = 5000;   //5 secs
        }

        [UnitOfWork]
        protected override void DoWork()
        {
            using (CurrentUnitOfWork.DisableFilter(AbpDataFilters.MayHaveTenant))
            {
                var freeEdition = _editionRepository.GetAll().FirstOrDefault(x => x.DisplayName == "Free");

                if (freeEdition == null)
                    return;

                var smeSubscriptions = _smeSubscriptionRepository.GetAll().Where(x=> x.EditionId != freeEdition.Id).ToList();

                foreach(var sub in smeSubscriptions)
                {
                    if(sub.ExpiryDate < DateTime.Now.AddHours(-12))
                    {
                        sub.EditionId = freeEdition.Id;
                        sub.ExpiryDate = null;

                        Logger.Info($"SmeSubscription.Id:{sub.Id} has expired and has been changed back to a Free Service.");
                    }
                }

                CurrentUnitOfWork.SaveChanges();
            }
        }
    }
}
