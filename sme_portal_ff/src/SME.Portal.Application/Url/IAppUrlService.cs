namespace SME.Portal.Url
{
    public interface IAppUrlService
    {
        string CreateEmailActivationUrlFormat(int? tenantId, string source = "");

        string CreatePasswordResetUrlFormat(int? tenantId);

        string CreateEmailActivationUrlFormat(string tenancyName, string source = "");

        string CreatePasswordResetUrlFormat(string tenancyName);
        string CreateFundFormUrlFormat();
    }
}
