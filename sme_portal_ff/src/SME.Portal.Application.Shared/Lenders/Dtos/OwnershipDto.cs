using Abp.Application.Services.Dto;
using System;
using System.Collections.Generic;
using System.Text;

namespace SME.Portal.Lenders.Dtos
{
    public class OwnershipDto : EntityDto
    {
        public string Demographic { get; set; }
        public string Measure { get; set; }
        public string Operator { get; set; }
        public string Percentage { get; set; }
    }
}
