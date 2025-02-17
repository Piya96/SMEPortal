using Abp.Domain.Entities.Auditing;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SME.Portal.Lenders
{
    public class WebsiteUrl : FullAuditedEntity
    {
        [MaxLength(1000)]
        [Required]
        public virtual string Url { get; set; }
        
        [Required]
        public virtual int FinanceProductId { get; set; }

        [ForeignKey("FinanceProductId")]
        public FinanceProduct FinanceProductFk { get; set; }

        [Required]
        public virtual bool IsPrimary { get; set; }
    }
}
