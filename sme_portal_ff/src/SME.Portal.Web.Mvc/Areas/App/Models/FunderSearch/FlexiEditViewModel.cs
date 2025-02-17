using SME.Portal.SME.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SME.Portal.Web.Areas.App.Models.FunderSearch
{
    public class FlexiEditViewModel
    {
        private GetApplicationForEditOutput _applicationForEditDto;

        public bool IsEditMode { get; set; }
        public FlexiEditViewModel(GetApplicationForEditOutput applicationForEditDto)
        {
            _applicationForEditDto = applicationForEditDto;
        }
    }
}
