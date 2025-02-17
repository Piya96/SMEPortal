using Abp.Domain.Entities.Auditing;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace SME.Portal.Lenders
{
    public class ResearchUrl : FullAuditedEntity
    {
        [Required]
        public virtual string Url { get; set; }

        [Required]
        public virtual int FinanceProductId { get; set; }
        
        [ForeignKey("FinanceProductId")]
        public FinanceProduct FinanceProductFk { get; set; }
    }
}