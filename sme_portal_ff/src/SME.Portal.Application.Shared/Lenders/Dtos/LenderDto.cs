
using System;
using Abp.Application.Services.Dto;

namespace SME.Portal.Lenders.Dtos
{
    public class LenderDto : EntityDto
    {
		public string Name { get; set; }

		public string WebsiteUrl { get; set; }

		public string FSPRegistrationNumber { get; set; }

		public string NcrNumber { get; set; }

        public virtual string PhysicalAddressLineOne { get; set; }

        public virtual string PhysicalAddressLineTwo { get; set; }

        public virtual string PhysicalAddressLineThree { get; set; }

        public virtual string City { get; set; }

        public virtual string HeadOfficeProvince { get; set; }

        public virtual string LenderType { get; set; }

        public virtual int? AccountManager { get; set; }

        public virtual string Country { get; set; }

        public virtual string Province { get; set; }

        public virtual int? PostalCode { get; set; }
        
        public bool HasContract { get; set; }

    }
}