using SME.Portal.Lenders.Dtos;

using Abp.Extensions;
using SME.Portal.Helpers;
using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc.Rendering;
using SME.Portal.List.Dtos;
using System.Linq;

namespace SME.Portal.Web.Areas.App.Models.Lenders
{
    public class CreateOrEditLenderModalViewModel
    {
       public CreateOrEditLenderDto Lender { get; set; }
       public List<FinanceProductDto> FinanceProducts { get; set; }
       public List<CountryDto> Country { get; set; }
       public List<ListItemDto> LenderTypeLists { get; set; }
       public int? FinanceProductCount { get; set; }
        public List<ListItemDto> ProvinceTypeLists { get; set; }
        public SelectList SelectProvinceTypeLists
        {
            get
            {
                if (ProvinceTypeLists?.Any() ?? false)
                {
                    return new SelectList(ProvinceTypeLists, "ListId", "Name");
                }
                return new SelectList(Enumerable.Empty<List<ListItemDto>>(), "ListId", "Name");
            }
        }
        public bool IsEditMode => Lender.Id.HasValue;

        public SelectList SelectLenderTypeLists
        {
            get
            {
                if (LenderTypeLists?.Any() ?? false)
                {
                    return new SelectList(LenderTypeLists, "ListId", "Name");
                }
                return new SelectList(Enumerable.Empty<List<ListItemDto>>(), "ListId", "Name");
            }
        }
    }
}