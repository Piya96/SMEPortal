using System;

using Abp.BackgroundJobs;
using Abp.Dependency;
using Abp.Domain.Uow;
using Abp.Threading;

using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using SME.Portal.Authorization.Users;
using SME.Portal.Company;
using SME.Portal.Net.Sms;
using SME.Portal.PropertiesJson;
using SME.Portal.SME;
using Twilio.Exceptions;

namespace SME.Portal.sefaLAS
{
    public class SefaLASCreateEnquiryBackgroundJob : BackgroundJob<SefaLASCreateEnquiryEventTriggerDto>, ITransientDependency
    {
        private readonly UserManager _userManager;

        private readonly IUnitOfWorkManager _unitOfWorkManager;
        private readonly ISefaLASAppService _sefaLASAppService;
        private readonly ApplicationAppServiceExt _applicationAppServiceExt;
        private readonly OwnersAppServiceExt _ownersAppServiceExt;
        private readonly ISmsSender _smsSender;

        public SefaLASCreateEnquiryBackgroundJob( UserManager userManager,
                                                  IUnitOfWorkManager unitOfWorkManager,
                                                  ISefaLASAppService sefaLASAppService,
                                                  ApplicationAppServiceExt applicationAppServiceExt,
                                                  OwnersAppServiceExt ownerAppServiceExt,
                                                  ISmsSender smsSender)
        {
            _userManager = userManager;
            _unitOfWorkManager = unitOfWorkManager;
            _sefaLASAppService = sefaLASAppService;
            _applicationAppServiceExt = applicationAppServiceExt;
            _ownersAppServiceExt = ownerAppServiceExt;
            _smsSender = smsSender; 
        }

        [UnitOfWork]
        public override void Execute(SefaLASCreateEnquiryEventTriggerDto request)
        {
            try
            {
                using var uow = _unitOfWorkManager.Begin();
                using (UnitOfWorkManager.Current.SetTenantId(request.TenantId))
                {
                    Logger.Info($"sefa LAS create enquiry integration job triggered for user.id:{request.UserId}");

                    var application = AsyncHelper.RunSync(() => _applicationAppServiceExt.GetApplicationForEdit(new Abp.Application.Services.Dto.EntityDto(request.ApplicationId)));   

                    if (application == null || request.TenantId != 3)
                    {
                        uow.Complete();
                        return;
                    }

                    var sefaLASJObj = AsyncHelper.RunSync(() => _sefaLASAppService.RequestEnquiryNumber(request.ApplicationId));

                    application.Application.PropertiesJson = sefaLASJObj.ToString();

                    var applicationId = AsyncHelper.RunSync(() => _applicationAppServiceExt.CreateOrEdit(application.Application));

                    var enquiryNumber = (string)sefaLASJObj["sefaLAS"]["EnquiryNumber"];
                    var owner = AsyncHelper.RunSync(() => _ownersAppServiceExt.GetOwnerForViewByUserId(application.Application.UserId));
                    SendSms(owner.Owner.PhoneNumber, $"A new SEFA Finance Application has been started. Use the EnquiryNumber #{enquiryNumber}");

                    uow.Complete();
                }
            }
            catch (Exception x)
            {
                Logger.Error($"SefaLASCreateEnquiryBackgroundJob failed with exception.Message:{x.Message}");
                throw x;
            }
        }

        private void SendSms(string mobile, string message)
        {
            try
            {
                _smsSender.SendAsync(mobile, message);
            }
            catch (ApiException x)
            {
                Logger.Error(x.Message);
            }
        }

    }
}
