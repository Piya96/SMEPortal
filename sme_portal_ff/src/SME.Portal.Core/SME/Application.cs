using SME.Portal.Authorization.Users;
using SME.Portal.Company;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities.Auditing;
using Abp.Domain.Entities;
using Abp.Auditing;
using SME.Portal.Lenders;
using SME.Portal.SME.Dtos;

namespace SME.Portal.SME
{

    [Table("Applications")]
    [Audited]
    public class Application : FullAuditedEntity, IMayHaveTenant
    {
        public int? TenantId { get; set; }

        [Required]
        public virtual string MatchCriteriaJson { get; set; }

        public virtual DateTime? Locked { get; set; }

        [Required]
        public virtual string Status { get; set; }

        public virtual long UserId { get; set; }

        [ForeignKey("UserId")]
        public User UserFk { get; set; }

        public virtual int SmeCompanyId { get; set; }

        [ForeignKey("SmeCompanyId")]
        public SmeCompany SmeCompanyFk { get; set; }

        public virtual string PropertiesJson { get; set; }

        public void Lock()
        {
            Status = ApplicationStatus.Locked.ToString();
            Locked = DateTime.Now;

        }

        public void SetStatus(Match match)
        {
            Status = match.MatchSuccessful ? ApplicationStatus.Matched.ToString() : ApplicationStatus.MatchedNoResults.ToString();
        }

    }
}