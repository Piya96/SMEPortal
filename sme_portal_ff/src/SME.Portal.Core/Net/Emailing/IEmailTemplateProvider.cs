namespace SME.Portal.Net.Emailing
{
    public interface IEmailTemplateProvider
    {
        string GetDefaultTemplate(int? tenantId);
        
        string GetTemplate(string templateName);

        string GetTemplateByTenantId(int? tenantId);
    }
}
