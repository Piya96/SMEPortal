using System;
using System.Linq;
using System.Linq.Dynamic.Core;
using Abp.Linq.Extensions;
using System.Collections.Generic;
using System.Threading.Tasks;
using Abp.Domain.Repositories;
using SME.Portal.Lenders.Exporting;
using SME.Portal.Lenders.Dtos;
using Abp.Application.Services.Dto;
using SME.Portal.Authorization;
using Abp.Authorization;
using Microsoft.EntityFrameworkCore;
using SME.Portal.Authorization.Users;
using Abp.Domain.Uow;
using Abp.Collections.Extensions;
using Abp.EntityFrameworkCore.EFPlus;
using System.Linq.Expressions;
using Z.EntityFramework.Plus;
using SME.Portal.List;

namespace SME.Portal.Lenders
{
    //[AbpAuthorize(AppPermissions.Pages_Administration_Lenders)]
    [AbpAuthorize]
    public class LendersAppService : PortalAppServiceBase, ILendersAppService
    {
        private readonly IRepository<Lender> _lenderRepository;
        private readonly IRepository<Countries> _countriesRepository;
        private readonly IRepository<FinanceProduct> _financeProductRepository;
        private readonly IRepository<Contract, int> _contractRepository;
        private readonly IRepository<User, long> _lookup_userRepository;
        private readonly IRepository<LendersComment, int> _commentRepository;
        private readonly ILendersExcelExporter _lendersExcelExporter;
        private readonly IUnitOfWorkManager _unitOfWorkManager;
        private readonly IListItemsAppService _listItemsAppService;

        public LendersAppService(IRepository<Lender> lenderRepository, ILendersExcelExporter lendersExcelExporter, IRepository<LendersComment, int> commentRepository, IRepository<Contract, int> contractRepository, IRepository<FinanceProduct> financeProductRepository, IRepository<User, long> lookup_userRepository, IUnitOfWorkManager unitOfWorkManager, IRepository<Countries> countriesRepository, IListItemsAppService listItemsAppService)
        {
            _lenderRepository = lenderRepository;
            _countriesRepository = countriesRepository;
            _commentRepository = commentRepository;
            _lendersExcelExporter = lendersExcelExporter;
            _contractRepository = contractRepository;
            _lookup_userRepository = lookup_userRepository;
            _financeProductRepository = financeProductRepository;
            _unitOfWorkManager = unitOfWorkManager;
            _listItemsAppService = listItemsAppService;
        }
        public async Task<PagedResultDto<GetLenderForViewDto>> GetAll(GetAllLendersInput input)
        {
            using (_unitOfWorkManager.Current.DisableFilter(AbpDataFilters.SoftDelete))
            {
                var filteredLenders = _lenderRepository.GetAll()
                 .WhereIf(!string.IsNullOrWhiteSpace(input.Filter), e => false || e.Name.StartsWith(input.Filter) || e.WebsiteUrl.StartsWith(input.Filter))
                 .WhereIf(!string.IsNullOrWhiteSpace(input.NameFilter), e => false || e.Name.StartsWith(input.NameFilter))
                 .WhereIf(AbpSession.TenantId.HasValue, e => e.TenantId == AbpSession.TenantId);

                var filteredLenderIds = filteredLenders.Select(a => a.Id).ToList();
                var financeProductCountDictionary = _financeProductRepository.GetAll().Where(a => filteredLenderIds.Contains(a.LenderId) && !a.IsDeleted && !a.Enabled).GroupBy(a => a.LenderId).Select(a => new { LenderId = a.Key, FinanceCount = a.Count() }).ToDictionary(a => a.LenderId, a => a.FinanceCount);

                //lenderTypesFilter options
                if (!String.IsNullOrEmpty(input.LenderTypesFilter))
                {
                    filteredLenders = filteredLenders.Where(u => u.LenderType == input.LenderTypesFilter);
                }

                //headofficeProvinceFilter options
                //if (input.HeadOfficeProvinceFilter.HasValue && input.HeadOfficeProvinceFilter > -1)
                //{
                //    filteredLenders = filteredLenders.Where(u => u.HeadOfficeProvince == input.HeadOfficeProvinceFilter);
                //}
                if (!String.IsNullOrEmpty(input.HeadOfficeProvinceFilter))
                {
                    filteredLenders = filteredLenders.Where(u => u.HeadOfficeProvince == input.HeadOfficeProvinceFilter);
                }

                //hascontractFilter options 
                if (input.HasContractFilter.HasValue)
                {
                    if (input.HasContractFilter == 1)
                    {
                        filteredLenders = filteredLenders.Where(u => u.HasContract);
                    }
                }

                //archivedFilter option
                if (input.hasArchivedFilter.HasValue)
                {
                    if (input.hasArchivedFilter == 1)
                    {
                        filteredLenders = filteredLenders.Where(u => u.IsDeleted);
                    }
                    else if (input.hasArchivedFilter == 0)
                    {
                        filteredLenders = filteredLenders.Where(u => !u.IsDeleted);
                    }
                }

                var pagedAndFilteredLenders = filteredLenders
                          .OrderBy(a => a.Name);

                var lenders = from o in pagedAndFilteredLenders
                              select new GetLenderForViewDto()
                              {
                                  Lender = new LenderDto
                                  {
                                      Name = o.Name,
                                      WebsiteUrl = o.WebsiteUrl,
                                      Id = o.Id,
                                      LenderType = !String.IsNullOrEmpty(o.LenderType) ? o.LenderType : null,
                                      HeadOfficeProvince = !String.IsNullOrEmpty(o.HeadOfficeProvince) ? o.HeadOfficeProvince : null
                                  },
                                  FinanceProductCount = financeProductCountDictionary.ContainsKey(o.Id) ? financeProductCountDictionary[o.Id] : 0,
                              };
                var totalCount = await filteredLenders.CountAsync();
                var result = await lenders.ToListAsync();
                if (result != null)
                {
                    foreach(var item in result) {
                        item.Lender.LenderType = !string.IsNullOrEmpty(item.Lender.LenderType) ? await _listItemsAppService.GetListItemsName(item.Lender.LenderType) : null;
                        item.Lender.HeadOfficeProvince = !string.IsNullOrEmpty(item.Lender.HeadOfficeProvince) ? await _listItemsAppService.GetListItemsName(item.Lender.HeadOfficeProvince) : null;
                    }
                }
                return new PagedResultDto<GetLenderForViewDto>(
                    totalCount,
                    result
                );
            }
        }
        public async Task<List<LenderDto>> GetAllEx()
        {
            var lenders = await _lenderRepository.GetAll().WhereIf(AbpSession.TenantId.HasValue, a => a.TenantId == AbpSession.TenantId && !a.IsDeleted).ToListAsync();

            return lenders.Select(a =>
                new LenderDto
                {
                    Name = a.Name,
                    WebsiteUrl = a.WebsiteUrl,
                    FSPRegistrationNumber = a.FSPRegistrationNumber,
                    NcrNumber = a.NcrNumber,
                    Id = a.Id
                }
            ).ToList();
        }

        [AbpAllowAnonymous]
        public async Task<GetLenderForViewDto> GetLenderForView(int id)
        {
            var lender = await _lenderRepository.GetAsync(id);

            var output = new GetLenderForViewDto { Lender = ObjectMapper.Map<LenderDto>(lender) };

            return output;
        }

        public async Task<List<CountryDto>> GetCountries()
        {
            var countries = await _countriesRepository.GetAll().Select(a => new { a.CountryCode, a.Country }).ToListAsync();
            var output = from a in countries
                         select new CountryDto
                         {
                             CountryCode = a.CountryCode,
                             Country = a.Country
                         };
            var result = output.ToList();
            return result;
        }

        public async Task<List<GetLenderCommentForViewDto>> GetLenderCommentForView(int LenderId)
        {
            var lenders = _commentRepository.GetAll()
                        .Include(e => e.UserFk).Where(a => a.LenderId == LenderId).Where(a => !a.IsDeleted);
            var comments = from o in lenders
                           join o2 in _lookup_userRepository.GetAll() on o.UserId equals o2.Id into j2
                           from s2 in j2.DefaultIfEmpty()

                           select new GetLenderCommentForViewDto()
                           {
                               Comment = new CommentDto
                               {
                                   Id = o.Id,
                                   CreationTime = o.CreationTime,
                                   Text = o.Text,
                                   LenderId = o.LenderId,
                                   UserId = o.UserId,
                               },
                               UserName = s2 == null || s2.Name == null ? "" : s2.Name.ToString()
                           };

            var output = await comments.ToListAsync();
            return output;
        }

        [AbpAuthorize(AppPermissions.Pages_Administration_Lenders_Edit)]
        public async Task<GetLenderForEditOutput> GetLenderForEdit(int id)
        {
            var lender = await _lenderRepository.FirstOrDefaultAsync(id);
            var output = new GetLenderForEditOutput { Lender = ObjectMapper.Map<CreateOrEditLenderDto>(lender) };

            return output;
        }

        public async Task CreateOrEdit(CreateOrEditLenderDto input)
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

        //comments logic
        public async Task CreateComment(CommentDto input)
        {
            var comment = ObjectMapper.Map<LendersComment>(input);
            await _commentRepository.InsertAsync(comment);
        }

        [AbpAuthorize(AppPermissions.Pages_Administration_Lenders_Create)]
        protected virtual async Task Create(CreateOrEditLenderDto input)
        {
            var lender = ObjectMapper.Map<Lender>(input);
            if (AbpSession.TenantId != null)
            {
                lender.TenantId = (int)AbpSession.TenantId;
            }
            await _lenderRepository.InsertAsync(lender);
        }

        [AbpAuthorize(AppPermissions.Pages_Administration_Lenders_Edit)]
        protected virtual async Task Update(CreateOrEditLenderDto input)
        {
            var lender = await _lenderRepository.FirstOrDefaultAsync((int)input.Id);
            ObjectMapper.Map(input, lender);
        }

        [AbpAuthorize(AppPermissions.Pages_Administration_Lenders_Delete)]
        public async Task Delete(EntityDto input)
        {

            await _lenderRepository.DeleteAsync(input.Id);
            await _financeProductRepository.DeleteAsync(a => a.LenderId == input.Id);

        }

        public async Task Retrieve(EntityDto input)
        {
            using (_unitOfWorkManager.Current.DisableFilter(AbpDataFilters.SoftDelete))
            {
                var lender = await _lenderRepository.FirstOrDefaultAsync((int)input.Id);
                lender.IsDeleted = false;
                await _lenderRepository.UpdateAsync(lender);
                Expression<Func<FinanceProduct, bool>> predicateFilter = a => a.LenderId == input.Id;
                Expression<Func<FinanceProduct, FinanceProduct>> updateExpression = u => new FinanceProduct { IsDeleted = false };
                await _financeProductRepository.BatchUpdateAsync(updateExpression, predicateFilter, null);
            }

        }

        public async Task DeleteComments(EntityDto input)
        {
            await _commentRepository.DeleteAsync(input.Id);
        }

    }
}