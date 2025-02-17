using System.Collections.Generic;
using MvvmHelpers;
using SME.Portal.Models.NavigationMenu;

namespace SME.Portal.Services.Navigation
{
    public interface IMenuProvider
    {
        ObservableRangeCollection<NavigationMenuItem> GetAuthorizedMenuItems(Dictionary<string, string> grantedPermissions);
    }
}