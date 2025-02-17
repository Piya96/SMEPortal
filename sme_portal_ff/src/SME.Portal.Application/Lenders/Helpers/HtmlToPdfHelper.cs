using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using SME.Portal.Lenders.Dtos;
using System;
using System.Collections.Generic;
using System.Net.Http.Headers;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace SME.Portal.Lenders.Helpers
{
    public static class HtmlToPdfHelper
    {
        public static async Task<RedirectResult> GetPdf(string url, string fileName, string apiToPdfBaseUrl)
        {
            string apiKey = "147de039-99c2-47ec-98ba-f20b7c1c61eb";
            string newFileName = fileName.Trim();

            using (var client = new HttpClient())
            {
                var model = new ChromeUrlToPdfRequestDto()
                {
                    Url = url,
                    FileName = $"{newFileName}.pdf",
                    InlinePdf = false
                };
                
                client.BaseAddress = new Uri(apiToPdfBaseUrl);
                var jsonContent = JsonConvert.SerializeObject(model);
                var content = new StringContent(jsonContent, Encoding.UTF8, "application/json");
                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(apiKey);
                var data = await client.PostAsync("/chrome/url", content);

                var result = JsonConvert.DeserializeObject<PdfApiResponseDto>(await data.Content.ReadAsStringAsync());

                return new RedirectResult(result.Pdf);
            }
        }
    }
}
