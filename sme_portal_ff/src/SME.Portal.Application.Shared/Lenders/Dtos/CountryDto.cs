using Abp.Application.Services.Dto;
using System;
using System.Collections.Generic;
using System.Text;

namespace SME.Portal.Lenders.Dtos
{
    public class CountryDto : EntityDto
    {
        public virtual string CountryCode { get; set; }
        
         public virtual string Country { get; set; }
    }
}
