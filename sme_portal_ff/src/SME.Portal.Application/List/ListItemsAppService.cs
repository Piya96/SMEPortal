using System;
using System.Linq;
using System.Linq.Dynamic.Core;
using Abp.Linq.Extensions;
using System.Collections.Generic;
using System.Threading.Tasks;
using Abp.Domain.Repositories;
using SME.Portal.List.Exporting;
using SME.Portal.List.Dtos;
using SME.Portal.Dto;
using Abp.Application.Services.Dto;
using SME.Portal.Authorization;
using Abp.Extensions;
using Abp.Authorization;
using Microsoft.EntityFrameworkCore;
using Abp.ObjectMapping;
using Microsoft.AspNetCore.Mvc;
using SME.Portal.Lenders.Dtos;

namespace SME.Portal.List
{
    [AbpAuthorize]
    public class ListItemsAppService : PortalAppServiceBase, IListItemsAppService
    {
        private readonly IRepository<ListItem> _listItemRepository;
        private readonly IListItemsExcelExporter _listItemsExcelExporter;
        private readonly IObjectMapper _objectMapper;

        public ListItemsAppService(IRepository<ListItem> listItemRepository, 
            IListItemsExcelExporter listItemsExcelExporter,
            IObjectMapper objectMapper)
        {
            _listItemRepository = listItemRepository;
            _listItemsExcelExporter = listItemsExcelExporter;
            _objectMapper = objectMapper;
        }
        
        public List<ListItemDto> GetAllGrandChildLists(string grandParentListId)
        {
            var lists = _listItemRepository.GetAll().Where(p => p.ParentListId == grandParentListId).ToList();
            var model = new List<ListItemDto>();
            lists.ForEach(list =>
            {
                var childlists = GetAllChildLists(list.ListId);
                foreach (var childlist in childlists)
                {
                    childlist.ParentName = list.Name;
                }
                model.AddRange(childlists);
            });

            return model;
        }
        
        public List<ListItemDto> GetAllChildLists(string parentListId)
        {
            if (parentListId == "0")
                parentListId = null;

            var lists = GetAllChildListsBatch(0, 100, parentListId)
                                            .Select(a => ObjectMapper.Map<ListItemDto>(a)).ToList();
            if (parentListId != null && lists.Any())
            {
                var parentList = GetListById(parentListId);
                lists.ForEach(list =>
                {
                    list.ParentName = parentList.Name;
                });
            }

            return lists;
        }

        private List<ListItem> GetAllChildListsBatch(int skip, int limit, string parentListId)
        {
            var lists = _listItemRepository.GetAll().Where(p => p.ParentListId == parentListId).OrderBy(p => p.Name).Skip(skip).Take(limit).ToList();
            if (lists.Count >= limit)
            {
                lists.AddRange(GetAllChildListsBatch(skip + limit, limit, parentListId));
            }
            return lists;
        }

        public ListItemDto GetListById(string id)
        {
            var list = _listItemRepository.FirstOrDefault(p => p.ListId == id);
            return ObjectMapper.Map<ListItemDto>(list);
        }

        public async Task<string> GetListItemsName(string id)
        {
            List<string> items = id.Split(',').ToList();
            var name = await _listItemRepository.GetAll().Where(p => items.Contains(p.ListId)).Select(p => p.Name).ToListAsync();
            var result = string.Join(";", name);
            return result;
        }

        [HttpPost]
        public async Task<PagedResultDto<GetListItemForViewDto>> GetAll(GetAllListItemsInput input)
        {

            var filteredListItems = _listItemRepository.GetAll()
                        .WhereIf(!string.IsNullOrWhiteSpace(input.Filter), e => false || e.Name.Contains(input.Filter) || e.ParentListId.Contains(input.Filter) || e.MetaOne.Contains(input.Filter) || e.MetaTwo.Contains(input.Filter) || e.ListId.Contains(input.Filter) || e.Slug.Contains(input.Filter) || e.MetaThree.Contains(input.Filter) || e.Details.Contains(input.Filter))
                        .WhereIf(!string.IsNullOrWhiteSpace(input.NameFilter), e => e.Name == input.NameFilter)
                        .WhereIf(!string.IsNullOrWhiteSpace(input.ParentListIdFilter), e => e.ParentListId == input.ParentListIdFilter)
                        .WhereIf(input.MinPriorityFilter != null, e => e.Priority >= input.MinPriorityFilter)
                        .WhereIf(input.MaxPriorityFilter != null, e => e.Priority <= input.MaxPriorityFilter)
                        .WhereIf(!string.IsNullOrWhiteSpace(input.MetaOneFilter), e => e.MetaOne == input.MetaOneFilter)
                        .WhereIf(!string.IsNullOrWhiteSpace(input.MetaTwoFilter), e => e.MetaTwo == input.MetaTwoFilter)
                        .WhereIf(!string.IsNullOrWhiteSpace(input.ListIdFilter), e => e.ListId == input.ListIdFilter)
                        .WhereIf(!string.IsNullOrWhiteSpace(input.SlugFilter), e => e.Slug == input.SlugFilter)
                        .WhereIf(!string.IsNullOrWhiteSpace(input.MetaThreeFilter), e => e.MetaThree == input.MetaThreeFilter)
                        .WhereIf(!string.IsNullOrWhiteSpace(input.DetailsFilter), e => e.Details == input.DetailsFilter);

            var pagedAndFilteredListItems = filteredListItems
                .OrderBy(input.Sorting ?? "id asc")
                .PageBy(input);

            var listItems = from o in pagedAndFilteredListItems
                            select new GetListItemForViewDto()
                            {
                                ListItem = new ListItemDto
                                {
                                    Id = o.Id,
                                    ListId = o.ListId,
                                    ParentListId = o.ParentListId,
                                    Name = o.Name,
                                    Details = o.Details,
                                    Priority = o.Priority,
                                    MetaOne = o.MetaOne,
                                    MetaTwo = o.MetaTwo,
                                    MetaThree = o.MetaThree,
                                    Slug = o.Slug
                                }
                            };

            var totalCount = await filteredListItems.CountAsync();

            return new PagedResultDto<GetListItemForViewDto>(
                totalCount,
                await listItems.ToListAsync()
            );
        }

        public List<ListItemDto> GetAll()
        {
            var listItems = _listItemRepository.GetAll();

            return listItems.Select(o => new ListItemDto()
            {
                Id = o.Id,
                ListId = o.ListId,
                ParentListId = o.ParentListId,
                Name = o.Name,
                Details = o.Details,
                Priority = o.Priority,
                MetaOne = o.MetaOne,
                MetaTwo = o.MetaTwo,
                MetaThree = o.MetaThree,
                Slug = o.Slug
            }).ToList();
        }

		public async Task<PagedResultDto<GetListItemForViewDto>> GetAllEx(GetAllListItemsInput input)
		{
			return await GetAll(input);
		}

		public async Task<GetListItemForViewDto> GetListItemForView(int id)
        {
            var listItem = await _listItemRepository.GetAsync(id);

            var output = new GetListItemForViewDto { ListItem = ObjectMapper.Map<ListItemDto>(listItem) };

            return output;
        }

        [AbpAuthorize(AppPermissions.Pages_Administration_ListItems_Edit)]
        public async Task<GetListItemForEditOutput> GetListItemForEdit(EntityDto input)
        {
            var listItem = await _listItemRepository.FirstOrDefaultAsync(input.Id);

            var output = new GetListItemForEditOutput { ListItem = ObjectMapper.Map<CreateOrEditListItemDto>(listItem) };

            return output;
        }

        public async Task CreateOrEdit(CreateOrEditListItemDto input)
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

        [AbpAuthorize(AppPermissions.Pages_Administration_ListItems_Create)]
        protected virtual async Task Create(CreateOrEditListItemDto input)
        {
            var listItem = ObjectMapper.Map<ListItem>(input);

            if (AbpSession.TenantId != null)
            {
                listItem.TenantId = (int?)AbpSession.TenantId;
            }

            await _listItemRepository.InsertAsync(listItem);
        }

        [AbpAuthorize(AppPermissions.Pages_Administration_ListItems_Edit)]
        protected virtual async Task Update(CreateOrEditListItemDto input)
        {
            var listItem = await _listItemRepository.FirstOrDefaultAsync((int)input.Id);
            ObjectMapper.Map(input, listItem);
        }

        [AbpAuthorize(AppPermissions.Pages_Administration_ListItems_Delete)]
        public async Task Delete(EntityDto input)
        {
            await _listItemRepository.DeleteAsync(input.Id);
        }

        public async Task<FileDto> GetListItemsToExcel(GetAllListItemsForExcelInput input)
        {

            var filteredListItems = _listItemRepository.GetAll()
                        .WhereIf(!string.IsNullOrWhiteSpace(input.Filter), e => false || e.Name.Contains(input.Filter) || e.ParentListId.Contains(input.Filter) || e.MetaOne.Contains(input.Filter) || e.MetaTwo.Contains(input.Filter) || e.ListId.Contains(input.Filter) || e.Slug.Contains(input.Filter) || e.MetaThree.Contains(input.Filter) || e.Details.Contains(input.Filter))
                        .WhereIf(!string.IsNullOrWhiteSpace(input.NameFilter), e => e.Name == input.NameFilter)
                        .WhereIf(!string.IsNullOrWhiteSpace(input.ParentListIdFilter), e => e.ParentListId == input.ParentListIdFilter)
                        .WhereIf(input.MinPriorityFilter != null, e => e.Priority >= input.MinPriorityFilter)
                        .WhereIf(input.MaxPriorityFilter != null, e => e.Priority <= input.MaxPriorityFilter)
                        .WhereIf(!string.IsNullOrWhiteSpace(input.MetaOneFilter), e => e.MetaOne == input.MetaOneFilter)
                        .WhereIf(!string.IsNullOrWhiteSpace(input.MetaTwoFilter), e => e.MetaTwo == input.MetaTwoFilter)
                        .WhereIf(!string.IsNullOrWhiteSpace(input.ListIdFilter), e => e.ListId == input.ListIdFilter)
                        .WhereIf(!string.IsNullOrWhiteSpace(input.SlugFilter), e => e.Slug == input.SlugFilter)
                        .WhereIf(!string.IsNullOrWhiteSpace(input.MetaThreeFilter), e => e.MetaThree == input.MetaThreeFilter)
                        .WhereIf(!string.IsNullOrWhiteSpace(input.DetailsFilter), e => e.Details == input.DetailsFilter);

            var query = (from o in filteredListItems
                         select new GetListItemForViewDto()
                         {
                             ListItem = new ListItemDto
                             {
                                 Name = o.Name,
                                 ParentListId = o.ParentListId,
                                 Priority = o.Priority,
                                 MetaOne = o.MetaOne,
                                 MetaTwo = o.MetaTwo,
                                 ListId = o.ListId,
                                 Slug = o.Slug,
                                 MetaThree = o.MetaThree,
                                 Details = o.Details,
                                 Id = o.Id
                             }
                         });

            var listItemListDtos = await query.ToListAsync();

            return _listItemsExcelExporter.ExportToFile(listItemListDtos);
        }

    }
}