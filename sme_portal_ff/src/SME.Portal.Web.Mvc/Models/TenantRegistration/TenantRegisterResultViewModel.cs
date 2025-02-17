using Abp.AutoMapper;
using SME.Portal.MultiTenancy.Dto;

namespace SME.Portal.Web.Models.TenantRegistration
{
    [AutoMapFrom(typeof(RegisterTenantOutput))]
    public class TenantRegisterResultViewModel : RegisterTenantOutput
    {
        public string TenantLoginAddress { get; set; }
    }
}