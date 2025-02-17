using Abp.Application.Services.Dto;
using System;
using System.Collections.Generic;
using System.Text;

namespace SME.Portal.Lenders.Dtos
{
    public class WebsiteUrlDto
    {
        public int Id { get; set; }

        public string Url { get; set; }

        public int FinanceProductId { get; set; }
        
        public bool IsPrimary { get; set; }
    }
}