using System.Threading.Tasks;
using Abp.Application.Services.Dto;
using SME.Portal.MultiTenancy.Accounting.Dto;

namespace SME.Portal.MultiTenancy.Accounting
{
    public interface IInvoiceAppService
    {
        Task<InvoiceDto> GetInvoiceInfo(EntityDto<long> input);

        Task<string> CreateInvoice(CreateInvoiceDto input);

    }
}
