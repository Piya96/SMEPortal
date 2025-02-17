using Abp.AutoMapper;
using SME.Portal.MultiTenancy;
using SME.Portal.MultiTenancy.Dto;
using SME.Portal.Web.Areas.App.Models.Common;

namespace SME.Portal.Web.Areas.App.Models.Tenants
{
    [AutoMapFrom(typeof (GetTenantFeaturesEditOutput))]
    public class TenantFeaturesEditViewModel : GetTenantFeaturesEditOutput, IFeatureEditViewModel
    {
        public Tenant Tenant { get; set; }
    }
}