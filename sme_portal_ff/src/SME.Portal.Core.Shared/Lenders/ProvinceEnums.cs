using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace SME.Portal.Lenders
{
    public enum ProvinceEnums
    {
        [Display(Name = "Eastern Cape")]
        EasternCape,

        [Display(Name = "Free State")]
        FreeState,

        [Display(Name = "Gauteng")]
        Gauteng,

        [Display(Name = "KwaZulu-Natal")]
        KwaZuluNatal,

        [Display(Name = "Limpopo")]
        Limpopo,

        [Display(Name = "Mpumalanga")]
        Mpumalanga,

        [Display(Name = "Nortern Cape")]
        NorternCape,

        [Display(Name = "North West")]
        NorthWest,

        [Display(Name = "Western Cape")]
        WesternCape
    }
}
