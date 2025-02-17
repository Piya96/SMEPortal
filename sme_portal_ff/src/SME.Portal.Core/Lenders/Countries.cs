using Abp.Auditing;
using Abp.Domain.Entities.Auditing;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace SME.Portal.Lenders
{
    [Table("Countries")]
    [Audited]
    public class Countries : FullAuditedEntity
    {
        public virtual string CountryCode { get; set; }

        public virtual string Country { get; set; }

        public virtual decimal VatRate { get; set; }

        public virtual Boolean IsSupported { get; set; }

        public virtual string DefaultTimeZone { get; set; }
    }

}
