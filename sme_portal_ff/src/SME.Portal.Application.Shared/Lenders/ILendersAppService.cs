using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Application.Services.Dto;
using SME.Portal.Lenders.Dtos;
using System.Collections.Generic;

namespace SME.Portal.Lenders
{
    public interface ILendersAppService : IApplicationService 
    {
        Task<PagedResultDto<GetLenderForViewDto>> GetAll(GetAllLendersInput input);

        Task<List<LenderDto>> GetAllEx();

        Task<GetLenderForViewDto> GetLenderForView(int id);

		Task<GetLenderForEditOutput> GetLenderForEdit(int id);

		Task CreateOrEdit(CreateOrEditLenderDto input);

		Task Delete(EntityDto input);

		Task Retrieve(EntityDto input);

        Task<List<GetLenderCommentForViewDto>> GetLenderCommentForView(int id);

        Task CreateComment(CommentDto input);

        Task DeleteComments(EntityDto input);
        
        Task<List<CountryDto>> GetCountries();
    }
}