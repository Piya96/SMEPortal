using Microsoft.AspNetCore.Mvc.Rendering;
using SME.Portal.List.Dtos;
using System.Collections.Generic;
using System.Linq;

namespace SME.Portal.Web.Areas.App.Models.Lenders
{
    public class LendersViewModel
    {
        public string FilterText { get; set; }
        public List<ListItemDto> LenderTypeLists { get; set; }
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