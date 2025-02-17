using Abp.Dependency;
using Abp.Domain.Repositories;
using Abp.Domain.Uow;
using Abp.Threading.BackgroundWorkers;
using Abp.Threading.Timers;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Hosting;
using SME.Portal.Authorization.Users;
using SME.Portal.Url;
using System;
using System.Linq;

namespace SME.Portal.Accounts
{
    public class EmailConfirmationReminderJob : PeriodicBackgroundWorkerBase, ISingletonDependency
    {
        public IAppUrlService AppUrlService { get; set; }

        private readonly IRepository<User, long> _userRepository;
        private readonly IUserEmailer _userEmailer;
        private readonly IWebHostEnvironment _webHostEnvironment;
        private readonly int _tenantId;

        public EmailConfirmationReminderJob(AbpTimer timer,
            IRepository<User, long> userRepository,
            IUserEmailer userEmailer,
            IWebHostEnvironment webHostEnvironment)
            : base(timer)
        {
            //Timer.Period = 5000;   //5 secs
            Timer.Period = 3600000;   //1 hour

            AppUrlService = NullAppUrlService.Instance;

            _userRepository = userRepository;
            _userEmailer = userEmailer;
            _webHostEnvironment = webHostEnvironment;

            _tenantId = 2;
        }

        [UnitOfWork]
        protected override void DoWork()
        {
            var isInProduction = _webHostEnvironment.IsProduction();

            Logger.Warn($"EmailConfirmationReminderJob is in production:{isInProduction}");

            if (isInProduction)
            {
                using (CurrentUnitOfWork.SetTenantId(_tenantId))
                {
                    // get all users who have unconfirmed email address who has not been sent an email confirmation reminder
                    var users = _userRepository.GetAllList(a => a.IsEmailConfirmed != true
                                                             && a.EmailConfirmationReminderSent != true
                                                             && a.EmailConfirmationSentDateUtc.HasValue
                                                             && EF.Functions.DateDiffHour(a.EmailConfirmationSentDateUtc, DateTime.UtcNow) >= 24);

                    foreach (var user in users)
                    {
                        user.SetNewEmailConfirmationCode();
                        var url = AppUrlService.CreateEmailActivationUrlFormat(_tenantId);
                        _userEmailer.SendEmailActivationLinkAsync(user, url).Wait();
                        user.EmailConfirmationReminderSent = true;
                        user.EmailConfirmationReminderSentDateUtc = DateTime.UtcNow;
                    }

                    if (users.Any())
                        CurrentUnitOfWork.SaveChanges();
                }
            }
        }
    }
}
