using Newtonsoft.Json.Linq;
using SME.Portal.SME.Dtos;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace SME.Portal.sefaLAS
{
    public interface ISefaLASAppService
    {
        Task<string> SendRequest(string jsonPayload, string endpoint);

        Task<string> CollateApplicationDataJson(int applicationId);

        Task<JObject> CollateDocumentDataJson(int companyId);

        Task<JObject> RequestEnquiryNumber(int applicationId);

        Task<string> RequestApplicationNumber(string propertiesJson, string dataJson = "");

        Task SendApplicationDocumentData(string documentJson);

        string GetEnquiryNumber(string propertiesJson);

        string GetApplicationNo(string propertiesJson);

        JObject SetSefaLASObject(JObject sefaLASJObj, string propertiesJson);

        Task<JObject> GetDocumentBinaryData(int id);
        Task<JObject> SetApplicationNo(string applicationNo, string propertiesJson);
    }
}
