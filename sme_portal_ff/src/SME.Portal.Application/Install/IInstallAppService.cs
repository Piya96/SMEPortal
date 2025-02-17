using System.Threading.Tasks;
using Abp.Application.Services;
using SME.Portal.Install.Dto;

namespace SME.Portal.Install
{
    public interface IInstallAppService : IApplicationService
    {
        Task Setup(InstallDto input);

        AppSettingsJsonDto GetAppSettingsJson();

        CheckDatabaseOutput CheckDatabase();
    }
}