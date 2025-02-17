using SME.Portal.Company;

using System;
using System.Linq;
using System.Linq.Dynamic.Core;
using Abp.Linq.Extensions;
using System.Collections.Generic;
using System.Threading.Tasks;
using Abp.Domain.Repositories;
using SME.Portal.Documents.Exporting;
using SME.Portal.Documents.Dtos;
using SME.Portal.Dto;
using Abp.Application.Services.Dto;
using SME.Portal.Authorization;
using Abp.Extensions;
using Abp.Authorization;
using Microsoft.EntityFrameworkCore;
using SME.Portal.SmeDocuments;
using SME.Portal.List;

namespace SME.Portal.Documents
{
    [AbpAuthorize]
    //[AbpAuthorize(AppPermissions.Pages_Administration_Documents)]
    public class DocumentsAppService : PortalAppServiceBase, IDocumentsAppService
    {
        internal readonly IRepository<Document> _documentRepository;
        internal readonly IDocumentsExcelExporter _documentsExcelExporter;
        internal readonly IRepository<SmeCompany, int> _lookup_smeCompanyRepository;
        private readonly IRepository<ListItem, int> _lookup_listItemRepository;

        public DocumentsAppService(IRepository<Document> documentRepository,
                                    IDocumentsExcelExporter documentsExcelExporter,
                                    IRepository<SmeCompany, int> lookup_smeCompanyRepository,
                                    IRepository<ListItem, int> lookup_listItemRepository)
        {
            _documentRepository = documentRepository;
            _documentsExcelExporter = documentsExcelExporter;
            _lookup_smeCompanyRepository = lookup_smeCompanyRepository;
            _lookup_listItemRepository = lookup_listItemRepository;

        }

        public async Task<PagedResultDto<GetDocumentForViewDto>> GetAll(GetAllDocumentsInput input)
        {

            var filteredDocuments = _documentRepository.GetAll()
                        .Include(e => e.SmeCompanyFk)
                        .WhereIf(!string.IsNullOrWhiteSpace(input.Filter), e => false || e.Type.Contains(input.Filter) || e.FileName.Contains(input.Filter) || e.FileType.Contains(input.Filter))
                        .WhereIf(!string.IsNullOrWhiteSpace(input.TypeFilter), e => e.Type == input.TypeFilter)
                        .WhereIf(!string.IsNullOrWhiteSpace(input.FileNameFilter), e => e.FileName == input.FileNameFilter)
                        .WhereIf(!string.IsNullOrWhiteSpace(input.FileTypeFilter), e => e.FileType == input.FileTypeFilter)
                        .WhereIf(!string.IsNullOrWhiteSpace(input.SmeCompanyNameFilter), e => e.SmeCompanyFk != null && e.SmeCompanyFk.Name == input.SmeCompanyNameFilter);

            var pagedAndFilteredDocuments = filteredDocuments
                .OrderBy(input.Sorting ?? "id asc")
                .PageBy(input);

            var documents = from o in pagedAndFilteredDocuments
                            join o1 in _lookup_smeCompanyRepository.GetAll() on o.SmeCompanyId equals o1.Id into j1
                            from s1 in j1.DefaultIfEmpty()

                            join l1 in _lookup_listItemRepository.GetAll() on o.Type equals l1.ListId into j2
                            from s2 in j2.DefaultIfEmpty()

                            select new GetDocumentForViewDto()
                            {
                                Document = new DocumentDto
                                {
                                    Type = s2.Name,
                                    FileName = o.FileName,
                                    FileType = o.FileType,
                                    Id = o.Id
                                },
                                SmeCompanyName = s1 == null || s1.Name == null ? "" : s1.Name.ToString()
                            };

            var totalCount = await filteredDocuments.CountAsync();

            return new PagedResultDto<GetDocumentForViewDto>(
                totalCount,
                await documents.ToListAsync()
            );
        }

        public async Task<GetDocumentForViewDto> GetDocumentForView(int id)
        {
            var document = await _documentRepository.GetAsync(id);

            var output = new GetDocumentForViewDto { Document = ObjectMapper.Map<DocumentDto>(document) };

            var _lookupSmeCompany = await _lookup_smeCompanyRepository.FirstOrDefaultAsync((int)output.Document.SmeCompanyId);
            output.SmeCompanyName = _lookupSmeCompany?.Name?.ToString();
            output.TypeName = DocumentTypes.GetDocumentTypeById(output.Document.Type).Name;

            return output;
        }

        //[AbpAuthorize(AppPermissions.Pages_Administration_Documents_Edit)]
        public async Task<GetDocumentForEditOutput> GetDocumentForEdit(EntityDto input)
        {
            var document = await _documentRepository.FirstOrDefaultAsync(input.Id);

            var output = new GetDocumentForEditOutput { Document = ObjectMapper.Map<CreateOrEditDocumentDto>(document) };

            var _lookupSmeCompany = await _lookup_smeCompanyRepository.FirstOrDefaultAsync((int)output.Document.SmeCompanyId);
            output.SmeCompanyName = _lookupSmeCompany?.Name?.ToString();

            return output;
        }

        public async Task CreateOrEdit(CreateOrEditDocumentDto input)
        {
            if (input.Id == null)
            {
                await Create(input);
            }
            else
            {
                await Update(input);
            }
        }

        // [AbpAuthorize(AppPermissions.Pages_Administration_Documents_Create)]
        protected virtual async Task Create(CreateOrEditDocumentDto input)
        {
            var document = ObjectMapper.Map<Document>(input);

            if (AbpSession.TenantId != null)
            {
                document.TenantId = (int)AbpSession.TenantId;
            }

            await _documentRepository.InsertAsync(document);
        }

        //[AbpAuthorize(AppPermissions.Pages_Administration_Documents_Edit)]
        protected virtual async Task Update(CreateOrEditDocumentDto input)
        {
            var document = await _documentRepository.FirstOrDefaultAsync((int)input.Id);
            ObjectMapper.Map(input, document);
        }

        //[AbpAuthorize(AppPermissions.Pages_Administration_Documents_Delete)]
        public async Task Delete(EntityDto input)
        {
            await _documentRepository.DeleteAsync(input.Id);
        }

        [AbpAuthorize(AppPermissions.Pages_Administration_Documents_Delete)]
        public async Task HardDeleteAsync(EntityDto input)
        {
            await _documentRepository.HardDeleteAsync(a => a.Id == input.Id);
        }

        public async Task<FileDto> GetDocumentsToExcel(GetAllDocumentsForExcelInput input)
        {

            var filteredDocuments = _documentRepository.GetAll()
                        .Include(e => e.SmeCompanyFk)
                        .WhereIf(!string.IsNullOrWhiteSpace(input.Filter), e => false || e.Type.Contains(input.Filter) || e.FileName.Contains(input.Filter) || e.FileType.Contains(input.Filter))
                        .WhereIf(!string.IsNullOrWhiteSpace(input.TypeFilter), e => e.Type == input.TypeFilter)
                        .WhereIf(!string.IsNullOrWhiteSpace(input.FileNameFilter), e => e.FileName == input.FileNameFilter)
                        .WhereIf(!string.IsNullOrWhiteSpace(input.FileTypeFilter), e => e.FileType == input.FileTypeFilter)
                        .WhereIf(!string.IsNullOrWhiteSpace(input.SmeCompanyNameFilter), e => e.SmeCompanyFk != null && e.SmeCompanyFk.Name == input.SmeCompanyNameFilter);

            var query = (from o in filteredDocuments
                         join o1 in _lookup_smeCompanyRepository.GetAll() on o.SmeCompanyId equals o1.Id into j1
                         from s1 in j1.DefaultIfEmpty()

                         select new GetDocumentForViewDto()
                         {
                             Document = new DocumentDto
                             {
                                 Type = o.Type,
                                 FileName = o.FileName,
                                 FileType = o.FileType,
                                 Id = o.Id
                             },
                             SmeCompanyName = s1 == null || s1.Name == null ? "" : s1.Name.ToString()
                         });

            var documentListDtos = await query.ToListAsync();

            return _documentsExcelExporter.ExportToFile(documentListDtos);
        }

        [AbpAuthorize(AppPermissions.Pages_Administration_Documents)]
        public async Task<PagedResultDto<DocumentSmeCompanyLookupTableDto>> GetAllSmeCompanyForLookupTable(GetAllForLookupTableInput input)
        {
            var query = _lookup_smeCompanyRepository.GetAll().WhereIf(
                   !string.IsNullOrWhiteSpace(input.Filter),
                  e => e.Name != null && e.Name.Contains(input.Filter)
               );

            var totalCount = await query.CountAsync();

            var smeCompanyList = await query
                .PageBy(input)
                .ToListAsync();

            var lookupTableDtoList = new List<DocumentSmeCompanyLookupTableDto>();
            foreach (var smeCompany in smeCompanyList)
            {
                lookupTableDtoList.Add(new DocumentSmeCompanyLookupTableDto
                {
                    Id = smeCompany.Id,
                    DisplayName = smeCompany.Name?.ToString()
                });
            }

            return new PagedResultDto<DocumentSmeCompanyLookupTableDto>(
                totalCount,
                lookupTableDtoList
            );
        }
    }
}