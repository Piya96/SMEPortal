using System;
using Abp.Application.Services.Dto;
using System.ComponentModel.DataAnnotations;

namespace SME.Portal.Lenders.Dtos
{
    public class GetMatchForEditOutput
    {
        public CreateOrEditMatchDto Match { get; set; }

    }
}