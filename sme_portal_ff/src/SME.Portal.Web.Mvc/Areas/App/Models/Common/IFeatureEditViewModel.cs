using System.Collections.Generic;
using Abp.Application.Services.Dto;
using SME.Portal.Editions.Dto;

namespace SME.Portal.Web.Areas.App.Models.Common
{
    public interface IFeatureEditViewModel
    {
        List<NameValueDto> FeatureValues { get; set; }

        List<FlatFeatureDto> Features { get; set; }
    }
}