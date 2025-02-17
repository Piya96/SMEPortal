using SME.Portal.Authorization.Users;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities.Auditing;
using Abp.Domain.Entities;
using Abp.Auditing;

namespace SME.Portal.ConsumerCredit
{
    [Table("CreditScores")]
    [Audited]
    public class CreditScore : Entity, IMustHaveTenant
    {
        public int TenantId { get; set; }

        public virtual int Score { get; set; }

        public virtual DateTime EnquiryDate { get; set; }

        public virtual long UserId { get; set; }

        [ForeignKey("UserId")]
        public User UserFk { get; set; }

    }
}