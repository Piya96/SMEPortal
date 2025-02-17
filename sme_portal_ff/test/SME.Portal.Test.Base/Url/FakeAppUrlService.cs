using SME.Portal.Url;

namespace SME.Portal.Test.Base.Url
{
    public class FakeAppUrlService : IAppUrlService
    {
        public string CreateEmailActivationUrlFormat(int? tenantId, string source = "")
        {
            return "http://test.com/";
        }

        public string CreatePasswordResetUrlFormat(int? tenantId)
        {
            return "http://test.com/";
        }

        public string CreateEmailActivationUrlFormat(string tenancyName, string source = "")
        {
            return "http://test.com/";
        }

        public string CreatePasswordResetUrlFormat(string tenancyName)
        {
            return "http://test.com/";
        }
        public string CreateFundFormUrlFormat()
        {
            return "http://test.com/";
        }

    }
}
