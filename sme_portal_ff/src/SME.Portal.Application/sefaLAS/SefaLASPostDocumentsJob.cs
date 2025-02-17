using System;
using System.Collections.Generic;
using System.Linq;
using Abp.Application.Services.Dto;
using Abp.BackgroundJobs;
using Abp.Dependency;
using Abp.Domain.Uow;
using Abp.Threading;

namespace SME.Portal.sefaLAS
{
    public class SefaLASPostDocumentsJob : BackgroundJob<SefaLASPostDocumentDataEventTriggerDto>, ITransientDependency
    {
        private readonly IUnitOfWorkManager _unitOfWorkManager;
        private readonly ISefaLASAppService _sefaLASAppService;

        public SefaLASPostDocumentsJob( IUnitOfWorkManager unitOfWorkManager,
                                        ISefaLASAppService sefaLASAppService)
        {
            _unitOfWorkManager = unitOfWorkManager;
            _sefaLASAppService = sefaLASAppService;
        }

        [UnitOfWork]
        public override void Execute(SefaLASPostDocumentDataEventTriggerDto request)
        {
            Logger.Info($"sefaLAS application document data post integration job triggered");

            try
            {
                using var uow = _unitOfWorkManager.Begin();
                using (UnitOfWorkManager.Current.SetTenantId(request.TenantId))
                {
                    AsyncHelper.RunSync(() => _sefaLASAppService.SendApplicationDocumentData(request.DocumentJson));

                    uow.Complete();
                }
            }
            catch (Exception x)
            {
                Logger.Error($"SefaLASPostDocumentsJob failed with exception.Message:{x.Message}");
                throw x;
            }
        }

    }
}
