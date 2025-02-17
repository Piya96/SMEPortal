using System;
using System.Web;
using Abp.Runtime.Security;
using Abp.Runtime.Validation;

namespace SME.Portal.Lenders.Dtos
{
    public class FundFormInput : IShouldNormalize
    {
        public Guid Token { get; set; }
        /// <summary>
        /// Encrypted values for {Token}
        /// </summary>
        public string c { get; set; }

        public void Normalize()
        {
            ResolveParameters();
        }

        protected virtual void ResolveParameters()
        {
            if (!string.IsNullOrEmpty(c))
            {
                var parameters = SimpleStringCipher.Instance.Decrypt(c);
                var query = HttpUtility.ParseQueryString(parameters);

                if (query["tokens"] != null)
                {
                    Token = Guid.Parse(query["tokens"]);
                }
            }
        }
    }
}




