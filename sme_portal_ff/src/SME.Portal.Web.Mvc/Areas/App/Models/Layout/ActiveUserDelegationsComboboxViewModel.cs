using System.Collections.Generic;
using SME.Portal.Authorization.Delegation;
using SME.Portal.Authorization.Users.Delegation.Dto;

namespace SME.Portal.Web.Areas.App.Models.Layout
{
    public class ActiveUserDelegationsComboboxViewModel
    {
        public IUserDelegationConfiguration UserDelegationConfiguration { get; set; }
        
        public List<UserDelegationDto> UserDelegations { get; set; }
    }
}
