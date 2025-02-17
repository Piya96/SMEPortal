using Abp.Domain.Entities.Auditing;
using SME.Portal.Authorization.Users;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace SME.Portal.Lenders
{
    public class FinanceProductComment : FullAuditedEntity
    {
        [Required]
        public string Text { get; set; }
        public virtual int FinanceProductId { get; set; }

        [ForeignKey("FinanceProductId")]
        public FinanceProduct FinanceProductFk { get; set; }
        
        public virtual long UserId { get; set; }

        [ForeignKey("UserId")]
        public User UserFk { get; set; }

    }
}