﻿using System.Threading.Tasks;
using Abp.Application.Services;
using SME.Portal.Configuration.Tenants.Dto;

namespace SME.Portal.Configuration.Tenants
{
    public interface ITenantSettingsAppService : IApplicationService
    {
        Task<TenantSettingsEditDto> GetAllSettings();

        Task UpdateAllSettings(TenantSettingsEditDto input);

        Task ClearLogo();

        Task ClearCustomCss();
    }
}
