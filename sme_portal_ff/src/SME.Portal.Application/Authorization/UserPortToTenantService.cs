using System;
using System.Collections.Generic;
using System.Threading.Tasks;

using Abp.Authorization;
using SME.Portal.Authorization.Users;
using SME.Portal.Authorization.Users.Dto;
using SME.Portal.Url;

namespace SME.Portal.Authorization
{
    [AbpAuthorize]
    public class UserPortToTenantService : PortalAppServiceBase, IUserPortToTenantService
    {
        private readonly IUserAppService _userAppService;
        private readonly UserRegistrationManager _userRegistrationManager;
        private readonly IAppUrlService _appUrlService;

        public UserPortToTenantService(IUserAppService userAppService, UserRegistrationManager userRegistrationManager, IAppUrlService appUrlService)
        {
            _userAppService = userAppService;
            _userRegistrationManager = userRegistrationManager;
            _appUrlService = appUrlService;
        }

        public async Task<bool> PortToTenant(UserEditDto user, int tenantId = 2)
        {
            return true;

            //try
            //{
            //    CurrentUnitOfWork.SetTenantId(tenantId);

            //    //var newUser = await _userRegistrationManager.RegisterAsync(
            //    //        user.Name, 
            //    //        user.Surname, 
            //    //        user.EmailAddress, 
            //    //        user.UserName, 
            //    //        user.Password, 
            //    //        true, 
            //    //        _appUrlService.CreateEmailActivationUrlFormat(tenantId));

            //    await CreateNewUser( user, new List<string>() { "User" }, shouldChangePasswordOnNextLogin: false, setRandomPassword: false, sendActivationEamil: false);

            //    await CurrentUnitOfWork.SaveChangesAsync();
            //}
            //catch (Exception ex)
            //{
            //    Logger.Error(ex.Message);
            //    return false;
            //}

            //return true;
        }


        private async Task CreateNewUser(UserEditDto userNew, List<string> roleNames, bool shouldChangePasswordOnNextLogin = true, bool setRandomPassword = true, bool sendActivationEamil = true)
        {
            userNew.ShouldChangePasswordOnNextLogin = shouldChangePasswordOnNextLogin;

            await _userAppService.CreateOrUpdateUser(new CreateOrUpdateUserInput
            {
                User = userNew,
                AssignedRoleNames = roleNames.ToArray(),
                SetRandomPassword = setRandomPassword,
                SendActivationEmail = sendActivationEamil
            });
        }
    }
}
