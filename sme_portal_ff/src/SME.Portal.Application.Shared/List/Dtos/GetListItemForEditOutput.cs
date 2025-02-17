using System;
using Abp.Application.Services.Dto;
using System.ComponentModel.DataAnnotations;

namespace SME.Portal.List.Dtos
{
    public class GetListItemForEditOutput
    {
        public CreateOrEditListItemDto ListItem { get; set; }

    }
}