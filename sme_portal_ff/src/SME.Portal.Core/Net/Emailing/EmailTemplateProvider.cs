using System;
using System.Collections.Concurrent;
using System.Text;
using Abp.Dependency;
using Abp.Extensions;
using Abp.IO.Extensions;
using Abp.MultiTenancy;
using Abp.Reflection.Extensions;
using SME.Portal.MultiTenancy;
using SME.Portal.Url;
using System.Collections.Generic;

namespace SME.Portal.Net.Emailing
{
    public class EmailTemplateProvider : IEmailTemplateProvider, ISingletonDependency
    {
        private readonly IWebUrlService _webUrlService;
        private readonly ITenantCache _tenantCache;
        private readonly ConcurrentDictionary<string, string> _defaultTemplates;
        private const string Path = "SME.Portal.Net.Emailing.EmailTemplates";
        private readonly Dictionary<int?, string> _tenantDictionary = new Dictionary<int?, string>() { { 2,"finfind-master"}, { 3, "sefa-master" },{ 5, "ecdc-master" }, { 9, "company-partners-master" },{ 10, "african-bank-master" },{ 12, "hloolo-master" } };

        public EmailTemplateProvider(IWebUrlService webUrlService, ITenantCache tenantCache)
        {
            _webUrlService = webUrlService;
            _tenantCache = tenantCache;
            _defaultTemplates = new ConcurrentDictionary<string, string>();
        }

        public string GetDefaultTemplate(int? tenantId)
        {
            var tenancyKey = tenantId.HasValue ? tenantId.Value.ToString() : "host";

            return _defaultTemplates.GetOrAdd(tenancyKey, key =>
            {
                return GetHtmlFile(tenantId, $"{Path}.default.html");
            });
        }

        public string GetTemplate(string templateName)
        {
            return _defaultTemplates.GetOrAdd(templateName, key =>
            {
                return GetHtmlFile(null, $"{Path}.{templateName}.html");
            });
        }

        public string GetTemplateByTenantId(int? TenantId)
        {
            return GetTemplate(_tenantDictionary[TenantId]);
        }

        public string GetHtmlFile(int? tenantId, string location)
        {
            using (var stream = typeof(EmailTemplateProvider).GetAssembly().GetManifestResourceStream(location))
            {
                var bytes = stream.GetAllBytes();
                var template = Encoding.UTF8.GetString(bytes, 3, bytes.Length - 3);
                template = template.Replace("{THIS_YEAR}", DateTime.Now.Year.ToString());
                return template.Replace("{EMAIL_LOGO_URL}", GetTenantLogoUrl(tenantId));
            }
        }

        private string GetTenantLogoUrl(int? tenantId)
        {
            if (!tenantId.HasValue)
            {
                return _webUrlService.GetServerRootAddress().EnsureEndsWith('/') + "TenantCustomization/GetTenantLogo?skin=light";
            }

            var tenant = _tenantCache.Get(tenantId.Value);
            return _webUrlService.GetServerRootAddress(tenant.TenancyName).EnsureEndsWith('/') + "TenantCustomization/GetTenantLogo?skin=light&tenantId=" + tenantId.Value;
        }
    }
}
