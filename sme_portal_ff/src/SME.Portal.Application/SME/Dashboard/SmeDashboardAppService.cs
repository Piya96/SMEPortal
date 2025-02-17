using Abp.Auditing;
using Abp.Authorization;
using SME.Portal.Authorization;
using SME.Portal.SME.Dashboard.Dto;
using System.Collections.Generic;

namespace SME.Portal.SME.Dashboard
{
    [DisableAuditing]
    [AbpAuthorize(AppPermissions.Pages_SME_Dashboard)]
    public class SmeDashboardAppService : PortalAppServiceBase, ISmeDashboardAppService
    {
        public GetDailySalesOutput GetDailySales()
        {
            return new GetDailySalesOutput
            {
                DailySales = DashboardRandomDataGenerator.GetRandomArray(30, 10, 50)
            };
        }
    }
}