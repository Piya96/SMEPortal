using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Text;

namespace SME.Portal.Company.Dtos
{
    public class SmeCompanyBackgroundCheckResult
    {
        public bool Success { get; set; }

        public Dictionary<string,string> Checks { get; set; }

        public Dictionary<string, JObject> VerificationRecords { get; set; }

    }
}
