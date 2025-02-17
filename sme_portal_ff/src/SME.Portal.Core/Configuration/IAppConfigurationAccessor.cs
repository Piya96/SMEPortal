using Microsoft.Extensions.Configuration;

namespace SME.Portal.Configuration
{
    public interface IAppConfigurationAccessor
    {
        IConfigurationRoot Configuration { get; }
    }
}
