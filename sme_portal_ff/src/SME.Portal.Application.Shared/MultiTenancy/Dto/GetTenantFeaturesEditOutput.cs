using System.Collections.Generic;
using Abp.Application.Services.Dto;
using SME.Portal.Editions.Dto;

namespace SME.Portal.MultiTenancy.Dto
{
    public class GetTenantFeaturesEditOutput
    {
        public List<NameValueDto> FeatureValues { get; set; }

        public List<FlatFeatureDto> Features { get; set; }
    }
}