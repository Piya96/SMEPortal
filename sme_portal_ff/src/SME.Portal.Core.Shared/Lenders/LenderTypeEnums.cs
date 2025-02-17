using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace SME.Portal.Lenders
{
    public enum LenderTypeEnums
    {
        [Display(Name = "Government")]
        Government,

        [Display(Name = "Banks - Large Bank")]
        LargeBank,
        
        [Display(Name = "Banks - Other Bank")]
        OtherBank,
        
        [Display(Name = "Private Lenders")]
        PrivateLenders               
    }
}
