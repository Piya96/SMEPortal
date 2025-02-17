

using System;
using System.Linq;
using System.Linq.Dynamic.Core;
using Abp.Linq.Extensions;
using System.Collections.Generic;
using System.Threading.Tasks;
using Abp.Domain.Repositories;
using SME.Portal.Currency.Exporting;
using SME.Portal.Currency.Dtos;
using SME.Portal.Dto;
using Abp.Application.Services.Dto;
using SME.Portal.Authorization;
using Abp.Extensions;
using Abp.Authorization;
using Microsoft.EntityFrameworkCore;

namespace SME.Portal.Currency
{
    [AbpAuthorize(AppPermissions.Pages_Administration_CurrencyPairs)]
    public class CurrencyPairsAppService : PortalAppServiceBase, ICurrencyPairsAppService
    {
        private readonly IRepository<CurrencyPair> _currencyPairRepository;
        private readonly ICurrencyPairsExcelExporter _currencyPairsExcelExporter;


        public CurrencyPairsAppService(IRepository<CurrencyPair> currencyPairRepository, ICurrencyPairsExcelExporter currencyPairsExcelExporter)
        {
            _currencyPairRepository = currencyPairRepository;
            _currencyPairsExcelExporter = currencyPairsExcelExporter;

        }

        public async Task<PagedResultDto<GetCurrencyPairForViewDto>> GetAll(GetAllCurrencyPairsInput input)
        {

            var filteredCurrencyPairs = _currencyPairRepository.GetAll()
                        .WhereIf(!string.IsNullOrWhiteSpace(input.Filter), e => false || e.Name.Contains(input.Filter) || e.BaseCurrencyCode.Contains(input.Filter) || e.TargetCurrencyCode.Contains(input.Filter) || e.Symbol.Contains(input.Filter) || e.Log.Contains(input.Filter))
                        .WhereIf(!string.IsNullOrWhiteSpace(input.NameFilter), e => e.Name == input.NameFilter)
                        .WhereIf(!string.IsNullOrWhiteSpace(input.BaseCurrencyCodeFilter), e => e.BaseCurrencyCode == input.BaseCurrencyCodeFilter)
                        .WhereIf(!string.IsNullOrWhiteSpace(input.TargetCurrencyCodeFilter), e => e.TargetCurrencyCode == input.TargetCurrencyCodeFilter)
                        .WhereIf(input.MinExchangeRateFilter != null, e => e.ExchangeRate >= input.MinExchangeRateFilter)
                        .WhereIf(input.MaxExchangeRateFilter != null, e => e.ExchangeRate <= input.MaxExchangeRateFilter)
                        .WhereIf(!string.IsNullOrWhiteSpace(input.SymbolFilter), e => e.Symbol == input.SymbolFilter)
                        .WhereIf(!string.IsNullOrWhiteSpace(input.LogFilter), e => e.Log == input.LogFilter);

            var pagedAndFilteredCurrencyPairs = filteredCurrencyPairs
                .OrderBy(input.Sorting ?? "id asc")
                .PageBy(input);

            var currencyPairs = from o in pagedAndFilteredCurrencyPairs
                                select new GetCurrencyPairForViewDto()
                                {
                                    CurrencyPair = new CurrencyPairDto
                                    {
                                        Name = o.Name,
                                        BaseCurrencyCode = o.BaseCurrencyCode,
                                        TargetCurrencyCode = o.TargetCurrencyCode,
                                        ExchangeRate = o.ExchangeRate,
                                        Symbol = o.Symbol,
                                        Log = o.Log,
                                        Id = o.Id
                                    }
                                };

            var totalCount = await filteredCurrencyPairs.CountAsync();

            return new PagedResultDto<GetCurrencyPairForViewDto>(
                totalCount,
                await currencyPairs.ToListAsync()
            );
        }

        [AbpAllowAnonymous]
        public List<CurrencyPairDto> GetAllCurrencyPairs()
        {
            var currencyPairs = _currencyPairRepository.GetAll();

            return currencyPairs.Select(o => new CurrencyPairDto
            {
                Name = o.Name,
                BaseCurrencyCode = o.BaseCurrencyCode,
                TargetCurrencyCode = o.TargetCurrencyCode,
                ExchangeRate = o.ExchangeRate,
                Symbol = o.Symbol,
                Log = o.Log,
                Id = o.Id
            }).ToList();
        }

        public async Task<GetCurrencyPairForViewDto> GetCurrencyPairForView(int id)
        {
            var currencyPair = await _currencyPairRepository.GetAsync(id);

            var output = new GetCurrencyPairForViewDto { CurrencyPair = ObjectMapper.Map<CurrencyPairDto>(currencyPair) };

            return output;
        }

        [AbpAuthorize(AppPermissions.Pages_Administration_CurrencyPairs_Edit)]
        public async Task<GetCurrencyPairForEditOutput> GetCurrencyPairForEdit(EntityDto input)
        {
            var currencyPair = await _currencyPairRepository.FirstOrDefaultAsync(input.Id);

            var output = new GetCurrencyPairForEditOutput { CurrencyPair = ObjectMapper.Map<CreateOrEditCurrencyPairDto>(currencyPair) };

            return output;
        }

        public async Task CreateOrEdit(CreateOrEditCurrencyPairDto input)
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

        [AbpAuthorize(AppPermissions.Pages_Administration_CurrencyPairs_Create)]
        protected virtual async Task Create(CreateOrEditCurrencyPairDto input)
        {
            var currencyPair = ObjectMapper.Map<CurrencyPair>(input);



            await _currencyPairRepository.InsertAsync(currencyPair);
        }

        [AbpAuthorize(AppPermissions.Pages_Administration_CurrencyPairs_Edit)]
        protected virtual async Task Update(CreateOrEditCurrencyPairDto input)
        {
            var currencyPair = await _currencyPairRepository.FirstOrDefaultAsync((int)input.Id);
            ObjectMapper.Map(input, currencyPair);
        }

        [AbpAuthorize(AppPermissions.Pages_Administration_CurrencyPairs_Delete)]
        public async Task Delete(EntityDto input)
        {
            await _currencyPairRepository.DeleteAsync(input.Id);
        }

        public async Task<FileDto> GetCurrencyPairsToExcel(GetAllCurrencyPairsForExcelInput input)
        {

            var filteredCurrencyPairs = _currencyPairRepository.GetAll()
                        .WhereIf(!string.IsNullOrWhiteSpace(input.Filter), e => false || e.Name.Contains(input.Filter) || e.BaseCurrencyCode.Contains(input.Filter) || e.TargetCurrencyCode.Contains(input.Filter) || e.Symbol.Contains(input.Filter) || e.Log.Contains(input.Filter))
                        .WhereIf(!string.IsNullOrWhiteSpace(input.NameFilter), e => e.Name == input.NameFilter)
                        .WhereIf(!string.IsNullOrWhiteSpace(input.BaseCurrencyCodeFilter), e => e.BaseCurrencyCode == input.BaseCurrencyCodeFilter)
                        .WhereIf(!string.IsNullOrWhiteSpace(input.TargetCurrencyCodeFilter), e => e.TargetCurrencyCode == input.TargetCurrencyCodeFilter)
                        .WhereIf(input.MinExchangeRateFilter != null, e => e.ExchangeRate >= input.MinExchangeRateFilter)
                        .WhereIf(input.MaxExchangeRateFilter != null, e => e.ExchangeRate <= input.MaxExchangeRateFilter)
                        .WhereIf(!string.IsNullOrWhiteSpace(input.SymbolFilter), e => e.Symbol == input.SymbolFilter)
                        .WhereIf(!string.IsNullOrWhiteSpace(input.LogFilter), e => e.Log == input.LogFilter);

            var query = (from o in filteredCurrencyPairs
                         select new GetCurrencyPairForViewDto()
                         {
                             CurrencyPair = new CurrencyPairDto
                             {
                                 Name = o.Name,
                                 BaseCurrencyCode = o.BaseCurrencyCode,
                                 TargetCurrencyCode = o.TargetCurrencyCode,
                                 ExchangeRate = o.ExchangeRate,
                                 Symbol = o.Symbol,
                                 Log = o.Log,
                                 Id = o.Id
                             }
                         });


            var currencyPairListDtos = await query.ToListAsync();

            return _currencyPairsExcelExporter.ExportToFile(currencyPairListDtos);
        }


    }
}