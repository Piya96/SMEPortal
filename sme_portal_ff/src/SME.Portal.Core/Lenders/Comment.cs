using Abp.Auditing;
using Abp.Domain.Entities.Auditing;
using SME.Portal.Authorization.Users;
using System;
using System.ComponentModel.DataAnnotations.Schema;
using SME.Portal.Lenders;
using System.ComponentModel.DataAnnotations;
using Abp.Domain.Entities;

namespace SME.Portal.Lenders

{

    [Table("Comment")]

    [Audited]

    public class Comment : FullAuditedEntity

    {

        public override int Id { get; set; }

        public override DateTime CreationTime { get; set; }

        public virtual string Text { get; set; }

        public virtual int LenderId { get; set; }

        [ForeignKey("LenderId")]

        public Lender LenderFk { get; set; }

        public virtual long UserId { get; set; }

        [ForeignKey("UserId")]

        public User UserFk { get; set; }


    }

}