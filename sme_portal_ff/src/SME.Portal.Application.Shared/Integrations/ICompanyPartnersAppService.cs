using System.Collections.Generic;
using System.Threading.Tasks;

namespace SME.Portal.Integrations
{
    public interface ICompanyPartnersAppService
    {
        /// <summary>
        /// 
        /// </summary>
        /// <param name="datapacket"></param>
        /// <returns></returns>
        Task<string> CreateCompanyPartnersLead(string dataJson);

    }
    public class CompanyPartnersPayloadArgs
    {
        public string Json { get; set; }
    }
}
