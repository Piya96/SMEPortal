using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace SME.Portal.SME
{
    public interface IApplicationReportingAppService
    {
        Task<List<Dictionary<string, string>>> GetDataExport();

    }
}
