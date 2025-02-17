using System.Collections.Generic;
using SME.Portal.Authorization.Users.Dto;

namespace SME.Portal.Web.Areas.App.Models.Users
{
    public class UserLoginAttemptModalViewModel
    {
        public List<UserLoginAttemptDto> LoginAttempts { get; set; }
    }
}