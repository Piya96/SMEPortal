﻿using System.Collections.Generic;
using Abp.Application.Services.Dto;
using SME.Portal.Authorization.Permissions.Dto;
using SME.Portal.Web.Areas.App.Models.Common;

namespace SME.Portal.Web.Areas.App.Models.Roles
{
    public class RoleListViewModel : IPermissionsEditViewModel
    {
        public List<FlatPermissionDto> Permissions { get; set; }

        public List<string> GrantedPermissionNames { get; set; }
    }
}