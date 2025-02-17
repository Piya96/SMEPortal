using Abp.AutoMapper;
using SME.Portal.Authorization.Roles.Dto;
using SME.Portal.Web.Areas.App.Models.Common;

namespace SME.Portal.Web.Areas.App.Models.Roles
{
    [AutoMapFrom(typeof(GetRoleForEditOutput))]
    public class CreateOrEditRoleModalViewModel : GetRoleForEditOutput, IPermissionsEditViewModel
    {
        public bool IsEditMode => Role.Id.HasValue;
    }
}