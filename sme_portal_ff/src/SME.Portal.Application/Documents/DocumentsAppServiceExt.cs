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
using SME.Portal.List;
using SME.Portal.Storage;
using SME.Portal.Documents;
using System.Net;
using Finfind.Data.Models.QLana;

namespace SME.Portal.Documents
{
    [AbpAuthorize]
    public class DocumentsAppServiceExt : DocumentsAppService
    {
		internal readonly IRepository<Document> _documentRepository;
		private readonly IRepository<ListItem, int> _lookup_listItemRepository;
        private readonly IRepository<BinaryObject, Guid> _binaryObj;
        private readonly IBinaryObjectManager _binaryObjectManager;

        public DocumentsAppServiceExt(IRepository<Document> documentRepository,
                                       IDocumentsExcelExporter documentsExcelExporter,
                                       IRepository<SmeCompany, int> lookup_smeCompanyRepository,
                                       IRepository<ListItem, int> lookup_listItemRepository,
                                       IRepository<BinaryObject, Guid> binaryObj,
                                       IBinaryObjectManager binaryObjectManager)
            : base(documentRepository, documentsExcelExporter, lookup_smeCompanyRepository, lookup_listItemRepository)
        {
			_documentRepository = documentRepository;
			_lookup_listItemRepository = lookup_listItemRepository;
            _binaryObj = binaryObj;
            _binaryObjectManager = binaryObjectManager;

        }

        public string GetTest()
        {
            return "Hello";
        }

        public async Task<PagedResultDto<GetDocumentForViewDto>> GetAllByUser(GetAllDocumentsInput input)
        {

            var filteredDocuments = _documentRepository.GetAll()
                        .Include(e => e.SmeCompanyFk)
                        .Where(a => a.CreatorUserId == input.UserIdFilter);

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
                                    Id = o.Id,
                                    BinaryObjectId = o.BinaryObjectId
                                },
                                SmeCompanyName = s1 == null || s1.Name == null ? "" : s1.Name.ToString()
                            };

            var totalCount = await filteredDocuments.CountAsync();

            return new PagedResultDto<GetDocumentForViewDto>(
                totalCount,
                await documents.ToListAsync()
            );
        }

        public async Task<PagedResultDto<GetDocumentForViewDto>> GetAllByCompanyId(int companyId)
        {

            var filteredDocuments = _documentRepository.GetAll()
                        .Include(e => e.SmeCompanyFk)
                        .Where(a => a.CreatorUserId == AbpSession.UserId)
                        .Where(e => e.SmeCompanyId == companyId);

            var documents = from o in filteredDocuments
                            join o1 in _lookup_smeCompanyRepository.GetAll() on o.SmeCompanyId equals o1.Id into j1
                            from s1 in j1.DefaultIfEmpty()

                            select new GetDocumentForViewDto()
                            {
                                Document = new DocumentDto
                                {
                                    Type = o.Type,
                                    FileName = o.FileName,
                                    FileType = o.FileType,
                                    Id = o.Id,
                                    SmeCompanyId = o.SmeCompanyId,
                                    BinaryObjectId = o.BinaryObjectId
                                },
                                SmeCompanyName = s1 == null || s1.Name == null ? "" : s1.Name.ToString()
                            };

            var totalCount = await filteredDocuments.CountAsync();

            return new PagedResultDto<GetDocumentForViewDto>(totalCount, await documents.ToListAsync());
        }

        public async Task<ListItem> GetDocumentListItemByTypeListId(string type)
        {
            return await _lookup_listItemRepository.FirstOrDefaultAsync(x=> x.ListId == type);
        }

        public async Task<GetDocumentForViewDto> GetByCompanyIdAndApplicationId(int companyId, int applicationId)
        {
            try
            {
                var result = await GetAllByCompanyId(companyId);
                for (int i = 0; i < result.TotalCount; i++)
                {
                    GetDocumentForViewDto doc = result.Items[i];
                    int lo = doc.Document.FileName.IndexOf('_', 0);
                    int hi = doc.Document.FileName.IndexOf('_', lo + 1);
                    int len = (hi - lo) - 1;
                    string applicationIdStr = doc.Document.FileName.Substring(lo + 1, len);
                    int tempId = int.Parse(applicationIdStr);
                    if (applicationId == tempId)
                    {
                        return doc;
                    }
                }
                return null;
            }
            catch (WebException ex)
            {
                throw new Exception("An error occurred:" + ex.Message);
            }
        }

        public async Task SaveDocument(byte[] byteArray, string fileName, string fileType, string documentTypeGuid, int companyId, int? tenantId = null)
        {
            try
            {
                var binaryObject = new BinaryObject()
                {
                    TenantId = tenantId,
                    Bytes = byteArray
                };

                await _binaryObjectManager.SaveAsync(binaryObject);

                await base.CreateOrEdit(new CreateOrEditDocumentDto()
                {
                    FileName = fileName,
                    FileType = fileType,
                    Type = documentTypeGuid,
                    BinaryObjectId = binaryObject.Id,
                    SmeCompanyId = companyId
                });

            }
            catch (Exception x)
            {
                Logger.Error($"Failed call to SaveDocument with exception:{x.Message}");
            }
        }

        public async Task HardDeleteDocumentAsync(Guid binaryObjectId)
        {
            await _binaryObjectManager.DeleteAsync(binaryObjectId);
        }

        public List<ListItem> GetSefaLoanTypes(string listId)
        {
            return _lookup_listItemRepository.GetAll().Where(a => a.MetaOne.Contains(listId)).ToList();
        }

        public async Task<List<GetDocumentForViewDto>> GetAllSefaDocumentsByUser(long userId, int companyId)
        {
            var result = new List<GetDocumentForViewDto>();
            var docs = await _documentRepository.GetAll().Where(a => a.CreatorUserId == userId && a.SmeCompanyId == companyId).ToListAsync();

            foreach (var doc in docs)
            {
                var output = new GetDocumentForViewDto { Document = ObjectMapper.Map<DocumentDto>(doc) };
                output.TypeName = _lookup_listItemRepository.FirstOrDefault(int.Parse(output.Document.Type))?.Name;

                result.Add(output);
            }

            return result;
        }

        public async Task<List<byte[]>> GetAllECDCDocumentsByUser(long userId, int companyId)
        {
            var result = new List<GetDocumentForViewDto>();
            var byteFiles = new List<byte[]>();
            var docs = await _documentRepository.GetAll().Where(a => a.CreatorUserId == userId && a.SmeCompanyId == companyId).ToListAsync();

            foreach (var doc in docs)
            {
                var output = new GetDocumentForViewDto { Document = ObjectMapper.Map<DocumentDto>(doc) };
                var fileObject = await _binaryObjectManager.GetOrNullAsync(output.Document.BinaryObjectId);
                byteFiles.Add(fileObject.Bytes);
            }

            return byteFiles;
        }

        public async Task<List<Tuple<byte[], string>>> GetAllECDCDocumentsWithFileName(long userId, int companyId)
        {
            var result = new List<GetDocumentForViewDto>();
            var bytesFileName = new List<Tuple<byte[], string>>();
            var docs = await _documentRepository.GetAll().Where(a => a.CreatorUserId == userId && a.SmeCompanyId == companyId).ToListAsync();

            foreach (var doc in docs)
            {
                var output = new GetDocumentForViewDto { Document = ObjectMapper.Map<DocumentDto>(doc) };
                var fileObject = await _binaryObjectManager.GetOrNullAsync(output.Document.BinaryObjectId);

                var fileName = output.Document.FileName;
                bytesFileName.Add(new Tuple<byte[], string>(fileObject.Bytes, fileName));
            }

            return bytesFileName;
        }

		public async Task<FileUploadDto> GetAllECDCDocumentsForQLana(long userId, int companyId)
		{
			var result = new FileUploadDto
			{
				Files = new List<File>()
			};
			var docs = await _documentRepository.GetAll().Where(a => a.CreatorUserId == userId && a.SmeCompanyId == companyId).ToListAsync();

			foreach(var doc in docs)
			{
				var output = new GetDocumentForViewDto { Document = ObjectMapper.Map<DocumentDto>(doc) };
				var fileObject = await _binaryObjectManager.GetOrNullAsync(output.Document.BinaryObjectId);
				var li = _lookup_listItemRepository.FirstOrDefault(a => a.ListId == output.Document.Type);
				var name = System.IO.Path.GetFileNameWithoutExtension(output.Document.FileName);
				var ext = System.IO.Path.GetExtension(output.Document.FileName);
				File file = new File
				{
					Filename = name + "-" + output.Document.Id.ToString() + ext,
					Base64Content = Convert.ToBase64String(fileObject.Bytes),
					DocumentType = output.Document.Type,
					Description = li?.Name
				};
				result.Files.Add(file);
			}

			return result;
		}

		public async Task<List<UploadedSefaDocumentDto>> GetAllUploadedSefaDocuments(string sefaLoanTypeListId, int companyId)
        {
            var result = new List<UploadedSefaDocumentDto>();

			var documentUploadTypes = await _lookup_listItemRepository.GetAll().Where(a => a.MetaOne.Contains(sefaLoanTypeListId)).ToListAsync();
            var uploadedDocs = await _documentRepository.GetAll().Where(a => a.CreatorUserId == AbpSession.UserId && a.SmeCompanyId == companyId).ToListAsync();


            foreach (var documentUploadType in documentUploadTypes)
            {
                var hasBeenUploaded = uploadedDocs.Any(a => a.Type == documentUploadType.ListId.ToString());
                var isRequired = documentUploadType.MetaTwo.Contains(sefaLoanTypeListId);
                result.Add(new UploadedSefaDocumentDto()
                {
                    Name = documentUploadType.Name,
                    HasBeenUploaded = hasBeenUploaded,
                    IsRequired = isRequired,
                    DocTypeGuid = documentUploadType.ListId,
                    TemplateUrl = documentUploadType.Slug
                });
            }

            return result;
        }

		public async Task<List<Document>> EnumDocs(string docGuid, int companyId)
		{
			try
			{
				var docList = _documentRepository.GetAll().Where(row => docGuid == row.Type && companyId == row.SmeCompanyId).ToList();
				return docList;
			}
			catch(Exception ex)
			{
				return new List<Document>();
			}
		}

		public async Task<bool> DeleteDocById(int documentObjectId)
		{
			try
			{
				List<Document> doc = _documentRepository.GetAll().Where(row => documentObjectId == row.Id).ToList();
				EntityDto input = new EntityDto();
				input.Id = doc[0].Id;
				await HardDeleteDocumentAsync(doc[0].BinaryObjectId);
				await HardDeleteAsync(input);
				return true;
			}
			catch(Exception ex)
			{
				return false;
			}
		}


		public async Task<bool> DeleteDoc(string type, int companyId)
		{
			try
			{
				List<Document> doc = _documentRepository.GetAll().Where(x => type == x.Type && companyId == x.SmeCompanyId).ToList();
				EntityDto input = new EntityDto();
				input.Id = doc[0].Id;
				await HardDeleteDocumentAsync(doc[0].BinaryObjectId);
				await HardDeleteAsync(input);
				return true;
			}
			catch(Exception ex)
			{
				return false;
			}
		}
	}
}
