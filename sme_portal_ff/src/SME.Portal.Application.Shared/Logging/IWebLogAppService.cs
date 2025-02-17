using Abp.Application.Services;
using SME.Portal.Dto;
using SME.Portal.Logging.Dto;

namespace SME.Portal.Logging
{
    public interface IWebLogAppService : IApplicationService
    {
        GetLatestWebLogsOutput GetLatestWebLogs();

        FileDto DownloadWebLogs();
    }
}
