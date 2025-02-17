using Abp;
using Abp.BackgroundJobs;
using Abp.Dependency;
using Abp.Domain.Repositories;
using Abp.Domain.Uow;
using Abp.Runtime.Session;
using Abp.Threading.BackgroundWorkers;
using Abp.Threading.Timers;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using SME.Portal.Authorization.Users;
using SME.Portal.Configuration;
using SME.Portal.HubSpot;
using SME.Portal.HubSpot.Dtos;
using SME.Portal.SME;
using SME.Portal.SME.Dtos;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;

namespace SME.Portal.sefa
{
    public class SefaApplicationAutoCancelJob : PeriodicBackgroundWorkerBase, ISingletonDependency
    {
        private readonly int _tenantId = 3;

        private readonly IRepository<Application, int> _applicationRepo;
        private readonly IUnitOfWorkManager _unitOfWorkManager;
        private readonly IUserEmailer _userEmailer;
        private readonly IConfigurationRoot _appConfiguration;
        private readonly IBackgroundJobManager _backgroundJobManager;
        public UserManager UserManager { get; set; }

        public SefaApplicationAutoCancelJob( AbpTimer timer,
                                             IRepository<Application, int> applicationRepo,
                                             IUnitOfWorkManager unitOfWorkManager,
                                             IAppConfigurationAccessor configurationAccessor,
                                             IUserEmailer userEmailer,
                                             IBackgroundJobManager backgroundJobManager)
            : base(timer)
        {
            //Should be 1440 - Once a day 
            //Timer.Period = MinutesToMilliseconds(1); // For testing purposes only
            Timer.Period = MinutesToMilliseconds(1440);
            _unitOfWorkManager = unitOfWorkManager;
            _applicationRepo = applicationRepo;
            _userEmailer = userEmailer;
            _appConfiguration = configurationAccessor.Configuration;
            _backgroundJobManager = backgroundJobManager;
        }

        [UnitOfWork]
        protected override void DoWork()
        {
            try
            {
                var timer = new Stopwatch();
                timer.Start();

                Logger.Info($"SefaApplicationAutoCancelJob Started");

                string _sefaSupportEmail1 = GetFromSettings("SefaSupport:Email1");
                string _sefaSupportEmail2 = GetFromSettings("SefaSupport:Email2");

                using var uow = _unitOfWorkManager.Begin();
                using (UnitOfWorkManager.Current.SetTenantId(_tenantId))
                {
                    /// Remember to REMOVE the x.id = 759 before release - testing only
                    //var applications = _applicationRepo.GetAllList().Where(x => x.TenantId == _tenantId && x.Id == 759 && x.Status == ApplicationStatus.Started.ToString()).ToList();
                    var applications = _applicationRepo.GetAllList().Where(x => x.TenantId == _tenantId && x.Status == ApplicationStatus.Started.ToString()).ToList();

                    foreach (var app in applications)
                    {
                        var user = UserManager.GetUserById(app.UserId);
                        JObject obj = JObject.Parse(app.PropertiesJson);
                        string enquiry = (string)obj["sefaLAS"]["EnquiryNumber"];

                        if (DateTime.Now.Date >= AddBusinessDays(app.CreationTime, 20).Date)
                        {
                            app.Status = ApplicationStatus.Abandoned.ToString();

                            _userEmailer.SendApplicationHasExpiredMail(user, enquiry);
                            _userEmailer.SendApplicationHasExpiredToSefaMail(_sefaSupportEmail1, _sefaSupportEmail2, "Support", enquiry);

                            _backgroundJobManager.Enqueue<HubSpotEventTriggerBackgroundJob, HubSpotEventTriggerDto>(new HubSpotEventTriggerDto()
                            {
                                TenantId = (int)user.TenantId,
                                UserId = app.UserId,
                                EventType = HubSpotEventTypes.CreateEdit,
                                HSEntityType = HubSpotEntityTypes.contacts,
                                UserJourneyPoint = UserJourneyContextTypes.ApplicationAbandoned
                            }, BackgroundJobPriority.Normal);
                        }
                        else
                        {
                            if (app.CreationTime.DayOfWeek == DayOfWeek.Saturday)
                            {
                                if (DateTime.Now.Date == (AddBusinessDays(app.CreationTime, 15).Date).AddDays(1))
                                {
                                    _userEmailer.SendApplicationExpiresSoonMail(user, enquiry);
                                }
                            }
                            else if (app.CreationTime.DayOfWeek == DayOfWeek.Sunday)
                            {
                                if (DateTime.Now.Date == (AddBusinessDays(app.CreationTime, 15).Date).AddDays(2))
                                {
                                    _userEmailer.SendApplicationExpiresSoonMail(user, enquiry);
                                }
                            }
                            else
                            {
                                if (DateTime.Now.Date == AddBusinessDays(app.CreationTime, 15).Date)
                                {
                                    _userEmailer.SendApplicationExpiresSoonMail(user, enquiry);
                                }
                            }
                        }
                    }

                    uow.Complete();
                }

                timer.Stop();

                Logger.Info($"SefaApplicationAutoCancelJob Stopped - Time taken {timer.Elapsed.ToString(@"dd\.hh\:mm\:ss")}");
            }
            catch (Exception x)
            {
                Logger.Error($"SefaApplicationAutoCancelJob failed with exception.Message:{x.Message}");
            }

        }

        private string GetFromSettings(string name, string defaultValue = null)
        {
            return _appConfiguration[name] ?? defaultValue;
        }

        private int MinutesToMilliseconds(int minutes)
        {
            return minutes * 60 * 1000;
        }

        public static DateTime AddBusinessDays(DateTime date, int days)
        {
            if (days < 0)
            {
                throw new ArgumentException("days cannot be negative", "days");
            }

            if (days == 0) return date;

            if (date.DayOfWeek == DayOfWeek.Saturday)
            {
                date = date.AddDays(2);
                days -= 1;
            }
            else if (date.DayOfWeek == DayOfWeek.Sunday)
            {
                date = date.AddDays(1);
                days -= 1;
            }

            date = date.AddDays(days / 5 * 7);
            int extraDays = days % 5;

            if ((int)date.DayOfWeek + extraDays > 5)
            {
                extraDays += 2;
            }

            return date.AddDays(extraDays);

        }
    }
}
