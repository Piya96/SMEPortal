using Abp.Application.Services;
using SME.Portal.SME.Dashboard.Dto;

namespace SME.Portal.SME.Dashboard
{
    public interface ISmeDashboardAppService : IApplicationService
    {
        GetDailySalesOutput GetDailySales();
    }
}
