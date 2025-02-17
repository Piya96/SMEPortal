using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace SME.Portal.Helpers
{
    public class HttpHelper
    {
        private HttpRequestMessage _request = null;

        public HttpHelper(UriBuilder uriBuilder, HttpMethod httpMethod, string headerKey = "", string headerValue = "", string content = "", string contentType = "application/json")
        {
            // create request
            _request = new HttpRequestMessage 
            { 
                RequestUri = uriBuilder.Uri, 
                Method = httpMethod, 
                Content = new StringContent(content, Encoding.UTF8, contentType)
            };

            // set key values
            _request.Headers.Add(headerKey, headerValue);

        }

        public async Task<string> SendAsync()
        {
            try
            {
                // response
                HttpResponseMessage response = await new HttpClient().SendAsync(_request);

                // return response
                return await response.Content.ReadAsStringAsync();
            }
            catch(WebException wx)
            {
                return wx.Message;
            }
            
        }


    }
}
