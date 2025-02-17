using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Application.Services.Dto;
using SME.Portal.Documents.Dtos;
using SME.Portal.Dto;

namespace SME.Portal.Documents
{
    public interface IDocumentsAppService : IApplicationService
    {
        Task<PagedResultDto<GetDocumentForViewDto>> GetAll(GetAllDocumentsInput input);
        Task<GetDocumentForViewDto> GetDocumentForView(int id);

        Task<GetDocumentForEditOutput> GetDocumentForEdit(EntityDto input);

        Task CreateOrEdit(CreateOrEditDocumentDto input);

        Task Delete(EntityDto input);

        Task HardDeleteAsync(EntityDto input);

        Task<FileDto> GetDocumentsToExcel(GetAllDocumentsForExcelInput input);

        Task<PagedResultDto<DocumentSmeCompanyLookupTableDto>> GetAllSmeCompanyForLookupTable(GetAllForLookupTableInput input);

    }
}