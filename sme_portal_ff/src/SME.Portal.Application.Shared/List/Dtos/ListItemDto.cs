using System;
using Abp.Application.Services.Dto;

namespace SME.Portal.List.Dtos
{
    public class ListItemDto : EntityDto
    {
        public string ListId { get; set; }
        public string ParentListId { get; set; }
        public string Name { get; set; }
        public string Details { get; set; }
        public int? Priority { get; set; }
        public string MetaOne { get; set; }
        public string MetaTwo { get; set; }
        public string MetaThree { get; set; }
        public string Slug { get; set; }

        public string ParentName { get; set; }
    }
}