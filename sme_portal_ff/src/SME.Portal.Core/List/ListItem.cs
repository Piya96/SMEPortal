using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities.Auditing;
using Abp.Domain.Entities;
using Abp.Auditing;

namespace SME.Portal.List
{
    [Table("ListItems")]
    [Audited]
    public class ListItem : FullAuditedEntity, IMayHaveTenant
    {
        public int? TenantId { get; set; }

        [Required]
        public virtual string ListId { get; set; }

        public virtual string ParentListId { get; set; }



        [Required]
        [StringLength(ListItemConsts.MaxNameLength, MinimumLength = ListItemConsts.MinNameLength)]
        public virtual string Name { get; set; }

        public virtual string Details { get; set; }

        public virtual int? Priority { get; set; }

        public virtual string MetaOne { get; set; }

        public virtual string MetaTwo { get; set; }

        public virtual string MetaThree { get; set; }
                
        public virtual string Slug { get; set; }

    }
}