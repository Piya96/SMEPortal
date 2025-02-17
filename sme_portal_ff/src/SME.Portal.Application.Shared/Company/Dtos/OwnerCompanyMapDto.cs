using System;
using Abp.Application.Services.Dto;

namespace SME.Portal.Company.Dtos
{
    public class OwnerCompanyMapDto : EntityDto
    {
        public bool IsPrimaryOwner { get; set; }

        public long? OwnerId { get; set; }

        public int? SmeCompanyId { get; set; }

		public long? UserId { get; set; }
	}
}