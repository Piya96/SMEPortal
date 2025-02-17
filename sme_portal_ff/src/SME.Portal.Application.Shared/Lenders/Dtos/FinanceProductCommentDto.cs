using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace SME.Portal.Lenders.Dtos
{
    public class FinanceProductCommentDto
    {
        public int Id { get; set; }
        public DateTime CreationTime { get; set; }
        public string Text { get; set; }
        public virtual int FinanceProductId { get; set; }
        public virtual long UserId { get; set; }
        public virtual string UserName { get; set; }
    }
}
