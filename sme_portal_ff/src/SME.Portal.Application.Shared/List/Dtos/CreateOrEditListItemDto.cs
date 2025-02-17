using System;
using Abp.Application.Services.Dto;
using System.ComponentModel.DataAnnotations;

namespace SME.Portal.List.Dtos
{
    public class CreateOrEditListItemDto : EntityDto<int?>
    {

        [Required]
        [StringLength(ListItemConsts.MaxNameLength, MinimumLength = ListItemConsts.MinNameLength)]
        public string Name { get; set; }

        public string ParentListId { get; set; }

        public int? Priority { get; set; }

        public string MetaOne { get; set; }

        public string MetaTwo { get; set; }

        [Required]
        public string ListId { get; set; }

        public string Slug { get; set; }

        public string MetaThree { get; set; }

        public string Details { get; set; }

    }
}