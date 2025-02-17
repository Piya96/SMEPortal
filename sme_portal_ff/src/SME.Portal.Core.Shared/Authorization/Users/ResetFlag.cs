using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace SME.Portal.Authorization.Users
{
    public enum ResetFlag
    {
        [Display(Name = "Shallow Reset")]
        ShallowReset = 0,
        [Display(Name = "Partial Reset")]
        PartialReset,
        [Display(Name = "Full Reset")]
        FullReset
    }
}
