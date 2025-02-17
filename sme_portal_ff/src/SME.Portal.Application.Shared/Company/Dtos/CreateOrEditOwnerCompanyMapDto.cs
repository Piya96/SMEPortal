using System;
using Abp.Application.Services.Dto;
using System.ComponentModel.DataAnnotations;

namespace SME.Portal.Company.Dtos
{
    public class CreateOrEditOwnerCompanyMapDto : EntityDto<int?>
    {

        public bool IsPrimaryOwner { get; set; }

        public long? OwnerId { get; set; }

        public int? SmeCompanyId { get; set; }

        public long? UserId { get; set; }

    }
}