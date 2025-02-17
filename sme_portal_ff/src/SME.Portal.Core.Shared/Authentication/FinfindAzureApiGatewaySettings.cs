using Abp.Extensions;
using System;
using System.Collections.Generic;
using System.Text;

namespace SME.Portal.Authentication
{
    public class FinfindAzureApiGatewaySettings
    {
        public bool Enabled { get; set; }
        public string KeyName { get; set; }
        public string KeyValue { get; set; }
        public string ApiUrl { get; set; }

        public bool IsValid()
        {
            return !KeyName.IsNullOrWhiteSpace() && !KeyValue.IsNullOrWhiteSpace() && !ApiUrl.IsNullOrWhiteSpace();
        }
    }
}
