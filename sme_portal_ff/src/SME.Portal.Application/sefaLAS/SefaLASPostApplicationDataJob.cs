using System;
using System.Collections.Generic;
using System.Linq;
using Abp.Application.Services.Dto;
using Abp.BackgroundJobs;
using Abp.Dependency;
using Abp.Domain.Repositories;
using Abp.Domain.Uow;
using Abp.Threading;

using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using SME.Portal.Authorization.Users;
using SME.Portal.Company;
using SME.Portal.Documents;
using SME.Portal.Documents.Dtos;
using SME.Portal.PropertiesJson;
using SME.Portal.SME;
using SME.Portal.Storage;

namespace SME.Portal.sefaLAS
{
    public class SefaLASPostApplicationDataJob : BackgroundJob<SefaLASPostApplicationDataEventTriggerDto>, ITransientDependency
    {
        private readonly IUnitOfWorkManager _unitOfWorkManager;
        private readonly ISefaLASAppService _sefaLASAppService;
        private readonly ApplicationAppServiceExt _applicationAppServiceExt;

        public SefaLASPostApplicationDataJob( IUnitOfWorkManager unitOfWorkManager,
                                              ApplicationAppServiceExt applicationAppServiceExt,
                                              ISefaLASAppService sefaLASAppService)
        {
            _unitOfWorkManager = unitOfWorkManager;
            _sefaLASAppService = sefaLASAppService;
            _applicationAppServiceExt = applicationAppServiceExt;
        }

        [UnitOfWork]
        public override void Execute(SefaLASPostApplicationDataEventTriggerDto request)
        {
            Logger.Info($"sefaLAS application data post integration job triggered for Application.id:{request.ApplicationId}");

            try
            {
                using var uow = _unitOfWorkManager.Begin();
                using (UnitOfWorkManager.Current.SetTenantId(request.TenantId))
                {
                    var application = AsyncHelper.RunSync(() => _applicationAppServiceExt.GetApplicationForEdit(new EntityDto(request.ApplicationId)));

                    // collate all data to json
                    var dataJson = AsyncHelper.RunSync(() => _sefaLASAppService.CollateApplicationDataJson(request.ApplicationId));

                    // request the sefaLAS application no
                    var sefaLASObj = AsyncHelper.RunSync(() => _sefaLASAppService.RequestApplicationNumber(application.Application.PropertiesJson, dataJson));

                    uow.Complete();
                }
            }
            catch (Exception x)
            {
                Logger.Error($"SefaLASPostApplicationDataJob failed with exception.Message:{x.Message}");
                throw x;
            }
        }

    }
}
