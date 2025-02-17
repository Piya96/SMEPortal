using SME.Portal.Lenders;
using SME.Portal.Authorization.Users;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities.Auditing;
using Abp.Domain.Entities;
using Abp.Auditing;

namespace SME.Portal.Lenders
{
	[Table("Contracts")]
    [Audited]
    public class Contract : FullAuditedEntity 
    {

		public virtual DateTime Start { get; set; }
		
		public virtual DateTime Expiry { get; set; }
		
		public virtual decimal Commission { get; set; }
		

		public virtual int LenderId { get; set; }
		
        [ForeignKey("LenderId")]
		public Lender LenderFk { get; set; }
		
		public virtual long UserId { get; set; }
		
        [ForeignKey("UserId")]
		public User UserFk { get; set; }
		
    }
}