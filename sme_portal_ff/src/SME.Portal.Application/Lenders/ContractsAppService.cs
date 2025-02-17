using SME.Portal.Lenders;
using SME.Portal.Authorization.Users;


using System;
using System.Linq;
using System.Linq.Dynamic.Core;
using Abp.Linq.Extensions;
using System.Collections.Generic;
using System.Threading.Tasks;
using Abp.Domain.Repositories;
using SME.Portal.Lenders.Exporting;
using SME.Portal.Lenders.Dtos;
using SME.Portal.Dto;
using Abp.Application.Services.Dto;
using SME.Portal.Authorization;
using Abp.Extensions;
using Abp.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;

namespace SME.Portal.Lenders
{
    //[AbpAuthorize(AppPermissions.Pages_Administration_Contracts)]
    [AbpAuthorize]
    public class ContractsAppService : PortalAppServiceBase, IContractsAppService
    {
		private readonly IRepository<Contract> _contractRepository;
		private readonly IContractsExcelExporter _contractsExcelExporter;
		private readonly IRepository<Lender,int> _lookup_lenderRepository;
		private readonly IRepository<User,long> _lookup_userRepository;
		
		public ContractsAppService(IRepository<Contract> contractRepository, IContractsExcelExporter contractsExcelExporter , IRepository<Lender, int> lookup_lenderRepository, IRepository<User, long> lookup_userRepository) 
		{
		    _contractRepository = contractRepository;
		    _contractsExcelExporter = contractsExcelExporter;
		    _lookup_lenderRepository = lookup_lenderRepository;
		    _lookup_userRepository = lookup_userRepository;
		}


        [HttpPost]
        public async Task<PagedResultDto<GetContractForViewDto>> GetAll(GetAllContractsInput input)
         {
			
			var filteredContracts = _contractRepository.GetAll()
						.Include( e => e.LenderFk)
						.Include( e => e.UserFk)
						.WhereIf(!string.IsNullOrWhiteSpace(input.Filter), e => false )
						.WhereIf(input.MinStartFilter != null, e => e.Start >= input.MinStartFilter)
						.WhereIf(input.MaxStartFilter != null, e => e.Start <= input.MaxStartFilter)
						.WhereIf(input.MinExpiryFilter != null, e => e.Expiry >= input.MinExpiryFilter)
						.WhereIf(input.MaxExpiryFilter != null, e => e.Expiry <= input.MaxExpiryFilter)
						.WhereIf(input.MinCommissionFilter != null, e => e.Commission >= input.MinCommissionFilter)
						.WhereIf(input.MaxCommissionFilter != null, e => e.Commission <= input.MaxCommissionFilter)
						.WhereIf(!string.IsNullOrWhiteSpace(input.LenderNameFilter), e => e.LenderFk != null && e.LenderFk.Name == input.LenderNameFilter)
						.WhereIf(!string.IsNullOrWhiteSpace(input.UserNameFilter), e => e.UserFk != null && e.UserFk.Name == input.UserNameFilter);

			var pagedAndFilteredContracts = filteredContracts
                .OrderBy(input.Sorting ?? "id asc")
                .PageBy(input);

			var contracts = from o in pagedAndFilteredContracts
                         join o1 in _lookup_lenderRepository.GetAll() on o.LenderId equals o1.Id into j1
                         from s1 in j1.DefaultIfEmpty()
                         
                         join o2 in _lookup_userRepository.GetAll() on o.UserId equals o2.Id into j2
                         from s2 in j2.DefaultIfEmpty()
                         
                         select new GetContractForViewDto() {
							Contract = new ContractDto
							{
                                Start = o.Start,
                                Expiry = o.Expiry,
                                Commission = o.Commission,
                                Id = o.Id
							},
                         	LenderName = s1 == null || s1.Name == null ? "" : s1.Name.ToString(),
                         	UserName = s2 == null || s2.Name == null ? "" : s2.Name.ToString()
						};

            var totalCount = await filteredContracts.CountAsync();

            return new PagedResultDto<GetContractForViewDto>(
                totalCount,
                await contracts.ToListAsync()
            );
         }
		 
		 public async Task<GetContractForViewDto> GetContractForView(int id)
         {
            var contract = await _contractRepository.GetAsync(id);

            var output = new GetContractForViewDto { Contract = ObjectMapper.Map<ContractDto>(contract) };

            var _lookupLender = await _lookup_lenderRepository.FirstOrDefaultAsync(output.Contract.LenderId);
            output.LenderName = _lookupLender?.Name?.ToString();

            var _lookupUser = await _lookup_userRepository.FirstOrDefaultAsync(output.Contract.UserId);
            output.UserName = _lookupUser?.Name?.ToString();

            return output;
         }
		 
		 [AbpAuthorize(AppPermissions.Pages_Administration_Contracts_Edit)]
		 public async Task<GetContractForEditOutput> GetContractForEdit(EntityDto input)
         {
            var contract = await _contractRepository.FirstOrDefaultAsync(input.Id);
           
		    var output = new GetContractForEditOutput {Contract = ObjectMapper.Map<CreateOrEditContractDto>(contract)};

            var _lookupLender = await _lookup_lenderRepository.FirstOrDefaultAsync((int)output.Contract.LenderId);
            output.LenderName = _lookupLender?.Name?.ToString();

            var _lookupUser = await _lookup_userRepository.FirstOrDefaultAsync((long)output.Contract.UserId);
            output.UserName = _lookupUser?.Name?.ToString();

            return output;
         }

		 public async Task CreateOrEdit(CreateOrEditContractDto input)
         {
            if(input.Id == null){
				await Create(input);
			}
			else{
				await Update(input);
			}
         }

		 [AbpAuthorize(AppPermissions.Pages_Administration_Contracts_Create)]
		 protected virtual async Task Create(CreateOrEditContractDto input)
         {
            var contract = ObjectMapper.Map<Contract>(input);

			

            await _contractRepository.InsertAsync(contract);
         }

		 [AbpAuthorize(AppPermissions.Pages_Administration_Contracts_Edit)]
		 protected virtual async Task Update(CreateOrEditContractDto input)
         {
            var contract = await _contractRepository.FirstOrDefaultAsync((int)input.Id);
             ObjectMapper.Map(input, contract);
         }

		 [AbpAuthorize(AppPermissions.Pages_Administration_Contracts_Delete)]
         public async Task Delete(EntityDto input)
         {
            await _contractRepository.DeleteAsync(input.Id);
         } 

		public async Task<FileDto> GetContractsToExcel(GetAllContractsForExcelInput input)
         {
			
			var filteredContracts = _contractRepository.GetAll()
						.Include( e => e.LenderFk)
						.Include( e => e.UserFk)
						.WhereIf(!string.IsNullOrWhiteSpace(input.Filter), e => false )
						.WhereIf(input.MinStartFilter != null, e => e.Start >= input.MinStartFilter)
						.WhereIf(input.MaxStartFilter != null, e => e.Start <= input.MaxStartFilter)
						.WhereIf(input.MinExpiryFilter != null, e => e.Expiry >= input.MinExpiryFilter)
						.WhereIf(input.MaxExpiryFilter != null, e => e.Expiry <= input.MaxExpiryFilter)
						.WhereIf(input.MinCommissionFilter != null, e => e.Commission >= input.MinCommissionFilter)
						.WhereIf(input.MaxCommissionFilter != null, e => e.Commission <= input.MaxCommissionFilter)
						.WhereIf(!string.IsNullOrWhiteSpace(input.LenderNameFilter), e => e.LenderFk != null && e.LenderFk.Name == input.LenderNameFilter)
						.WhereIf(!string.IsNullOrWhiteSpace(input.UserNameFilter), e => e.UserFk != null && e.UserFk.Name == input.UserNameFilter);

			var query = (from o in filteredContracts
                         join o1 in _lookup_lenderRepository.GetAll() on o.LenderId equals o1.Id into j1
                         from s1 in j1.DefaultIfEmpty()
                         
                         join o2 in _lookup_userRepository.GetAll() on o.UserId equals o2.Id into j2
                         from s2 in j2.DefaultIfEmpty()
                         
                         select new GetContractForViewDto() { 
							Contract = new ContractDto
							{
                                Start = o.Start,
                                Expiry = o.Expiry,
                                Commission = o.Commission,
                                Id = o.Id
							},
                         	LenderName = s1 == null || s1.Name == null ? "" : s1.Name.ToString(),
                         	UserName = s2 == null || s2.Name == null ? "" : s2.Name.ToString()
						 });


            var contractListDtos = await query.ToListAsync();

            return _contractsExcelExporter.ExportToFile(contractListDtos);
         }



		[AbpAuthorize(AppPermissions.Pages_Administration_Contracts)]
         public async Task<PagedResultDto<ContractLenderLookupTableDto>> GetAllLenderForLookupTable(GetAllForLookupTableInput input)
         {
             var query = _lookup_lenderRepository.GetAll().WhereIf(
                    !string.IsNullOrWhiteSpace(input.Filter),
                   e=> e.Name != null && e.Name.Contains(input.Filter)
                );

            var totalCount = await query.CountAsync();

            var lenderList = await query
                .PageBy(input)
                .ToListAsync();

			var lookupTableDtoList = new List<ContractLenderLookupTableDto>();
			foreach(var lender in lenderList){
				lookupTableDtoList.Add(new ContractLenderLookupTableDto
				{
					Id = lender.Id,
					DisplayName = lender.Name?.ToString()
				});
			}

            return new PagedResultDto<ContractLenderLookupTableDto>(
                totalCount,
                lookupTableDtoList
            );
         }

		[AbpAuthorize(AppPermissions.Pages_Administration_Contracts)]
         public async Task<PagedResultDto<ContractUserLookupTableDto>> GetAllUserForLookupTable(GetAllForLookupTableInput input)
         {
             var query = _lookup_userRepository.GetAll().WhereIf(
                    !string.IsNullOrWhiteSpace(input.Filter),
                   e=> e.Name != null && e.Name.Contains(input.Filter)
                );

            var totalCount = await query.CountAsync();

            var userList = await query
                .PageBy(input)
                .ToListAsync();

			var lookupTableDtoList = new List<ContractUserLookupTableDto>();
			foreach(var user in userList){
				lookupTableDtoList.Add(new ContractUserLookupTableDto
				{
					Id = user.Id,
					DisplayName = user.Name?.ToString()
				});
			}

            return new PagedResultDto<ContractUserLookupTableDto>(
                totalCount,
                lookupTableDtoList
            );
         }
    }
}