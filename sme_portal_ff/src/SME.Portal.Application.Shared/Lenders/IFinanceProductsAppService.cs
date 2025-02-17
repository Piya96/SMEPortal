using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Application.Services.Dto;
using SME.Portal.Lenders.Dtos;
using System.Collections.Generic;

namespace SME.Portal.Lenders
{
    public interface IFinanceProductsAppService : IApplicationService
    {
        Task<PagedResultDto<GetFinanceProductForViewDto>> SearchAll(SearchAllFinanceProductsInput input);

        List<FinanceProductDto> GetAllFinanceProductsById(List<int> ids);

        FinanceProductViewDto GetFinanceProductById(EntityDto input);

        Task<GetFinanceProductForViewDto> GetFinanceProductForView(int id);

        Task<int> CreateOrEdit(CreateOrEditFinanceProductDto input);

        Task Delete(EntityDto input);

        Task<LastUpdatedLegendDto> GetLastUpdatedStatus();

        Task<WebsiteUrlDto> AddWebsiteUrl(CreateWebsiteUrlDto input);

        Task<int> AddResearchUrl(CreateResearchUrlDto input);

        Task ResetPrimaryUrls(WebsiteUrlDto WebsiteUrl, int financeProductId);

        Task<List<WebsiteUrlDto>> GetWebsiteUrlsByFinanceProductId(int financeProductId);

        Task MergeFundFormsPrimaryWebsiteUrls(int financeProductId, string FundWebsiteAddress);

        Task<List<ResearchUrlDto>> GetResearchUrlsByFinanceProductId(int financeProductId);

        Task DeleteWebsiteUrl(int websiteurlId);

        Task DeleteResearchUrl(int researchurlId);

        Task CreateFinanceProductComment(FinanceProductCommentDto input);

        Task<List<FinanceProductCommentDto>> GetFinanceProductCommentsByFinanceProductId(int financeProductId);

        Task DeleteFinanceProductComments(int commentId);

        Task UpdateCheckedOutSubjectId(int id, int? userId);
        
        List<FinanceProductDto> GetAllFinanceProductsByLenderId(int lenderId);
    }
}