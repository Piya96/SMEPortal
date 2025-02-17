using System.Threading.Tasks;
using Abp.Dependency;

namespace SME.Portal.MultiTenancy.Accounting
{
    public interface IInvoiceNumberGenerator : ITransientDependency
    {
        Task<string> GetNewInvoiceNumber();
    }
}