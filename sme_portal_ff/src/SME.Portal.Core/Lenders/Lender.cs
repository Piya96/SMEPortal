using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities.Auditing;
using Abp.Domain.Entities;
using Abp.Auditing;
using SME.Portal.List;

namespace SME.Portal.Lenders
{
	[Table("Lenders")]
    [Audited]
    public class Lender : FullAuditedEntity 
    {
        public int TenantId { get; set; }

        [Required]
		[StringLength(LenderConsts.MaxNameLength, MinimumLength = LenderConsts.MinNameLength)]
        public virtual string Name { get; set; }
		
		public virtual string WebsiteUrl { get; set; }
		
		public virtual string FSPRegistrationNumber { get; set; }
		
		public virtual string NcrNumber { get; set; }

		public virtual string VersionLabel { get; set; }

        public virtual string PhysicalAddressLineOne { get; set; }

        public virtual string PhysicalAddressLineTwo { get; set; }

        public virtual string PhysicalAddressLineThree { get; set; }

        public virtual string City { get; set; }

        public string HeadOfficeProvince { get; set; }

        public string LenderType { get; set; }

        public virtual int? AccountManager { get; set; }

        public virtual string Country { get; set; }

        public string Province { get; set; }

        public virtual int? PostalCode { get; set; }

        public bool HasContract { get; set; }

    }
}