using Abp.AutoMapper;
using SME.Portal.MultiTenancy.Dto;

namespace SME.Portal.Web.Models.TenantRegistration
{
    [AutoMapFrom(typeof(EditionsSelectOutput))]
    public class EditionsSelectViewModel : EditionsSelectOutput
    {
    }
}
