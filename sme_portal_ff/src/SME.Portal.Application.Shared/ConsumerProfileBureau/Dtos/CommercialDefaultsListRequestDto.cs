using System;
using System.Collections.Generic;
using System.Text;

namespace SME.Portal.ConsumerProfileBureau.Dtos
{
    public class CommercialDefaultsListRequestDto : IndividualListRequestDto
    {
        public string RegistrationNumber { get; set; }
    }
}
