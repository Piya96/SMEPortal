using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using System.Transactions;
using Abp.AspNetCore.Mvc.Authorization;
using Abp.Authorization;
using Abp.Authorization.Users;
using Abp.Collections.Extensions;
using Abp.Configuration;
using Abp.Configuration.Startup;
using Abp.Domain.Uow;
using Abp.Extensions;
using Abp.MultiTenancy;
using Abp.Net.Mail;
using Abp.Notifications;
using Abp.Runtime.Session;
using Abp.Timing;
using Abp.UI;
using Abp.Web.Models;
using Abp.Zero.Configuration;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.Extensions.Options;
using SME.Portal.Authentication.TwoFactor.Google;
using SME.Portal.Authorization;
using SME.Portal.Authorization.Accounts;
using SME.Portal.Authorization.Accounts.Dto;
using SME.Portal.Authorization.Delegation;
using SME.Portal.Authorization.Impersonation;
using SME.Portal.Authorization.Users;
using SME.Portal.Configuration;
using SME.Portal.Debugging;
using SME.Portal.Identity;
using SME.Portal.MultiTenancy;
using SME.Portal.Net.Sms;
using SME.Portal.Notifications;
using SME.Portal.Web.Models.Account;
using SME.Portal.Security;
using SME.Portal.Security.Recaptcha;
using SME.Portal.Sessions;
using SME.Portal.Url;
using SME.Portal.Web.Authentication.External;
using SME.Portal.Web.Security.Recaptcha;
using SME.Portal.Web.Session;
using SME.Portal.Web.Views.Shared.Components.TenantChange;
using Abp.BackgroundJobs;
using SME.Portal.HubSpot;
using SME.Portal.HubSpot.Dtos;
using SME.Portal.Helpers;
using SME.Portal.sefaLAS;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Abp.Domain.Repositories;
using Abp.Runtime.Security;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Hosting;
using SME.Portal.Authorization.Users.Profile;
using SME.Portal.Authorization.Users.Profile.Dto;

namespace SME.Portal.Web.Controllers
{
    public class AccountController : PortalControllerBase
    {
		private readonly ProfileAppService _profileAppService;
		private readonly IWebHostEnvironment _webHostEnvironment;
		private readonly UserAppService _userAppService;
		private readonly IRepository<User, long> _userRepository;
		private readonly UserManager _userManager;
        private readonly TenantManager _tenantManager;
        private readonly IMultiTenancyConfig _multiTenancyConfig;
        private readonly IUnitOfWorkManager _unitOfWorkManager;
        private readonly IWebUrlService _webUrlService;
        private readonly IAppUrlService _appUrlService;
        private readonly IAppNotifier _appNotifier;
        private readonly AbpLoginResultTypeHelper _abpLoginResultTypeHelper;
        private readonly IUserLinkManager _userLinkManager;
        private readonly LogInManager _logInManager;
        private readonly SignInManager _signInManager;
        private readonly IRecaptchaValidator _recaptchaValidator;
        private readonly IPerRequestSessionCache _sessionCache;
        private readonly ITenantCache _tenantCache;
        private readonly IAccountAppService _accountAppService;
        private readonly UserRegistrationManager _userRegistrationManager;
        private readonly IImpersonationManager _impersonationManager;
        private readonly ISmsSender _smsSender;
        private readonly IEmailSender _emailSender;
        private readonly IPasswordComplexitySettingStore _passwordComplexitySettingStore;
        private readonly IdentityOptions _identityOptions;
        private readonly ISessionAppService _sessionAppService;
        private readonly ExternalLoginInfoManagerFactory _externalLoginInfoManagerFactory;
        private readonly ISettingManager _settingManager;
        private readonly IUserDelegationManager _userDelegationManager;
        private readonly IBackgroundJobManager _backgroundJobManager;
        public string BusinessSupportUrl = "ECDCbusinessSupport/BusinessSupport";
        //public Singleton1 s;

        public AccountController(
			ProfileAppService profileAppService,
			IWebHostEnvironment webHostEnvironment,
			IRepository<User, long> userRepository,
			UserAppService userAppService,
			UserManager userManager,
            IMultiTenancyConfig multiTenancyConfig,
            TenantManager tenantManager,
            IUnitOfWorkManager unitOfWorkManager,
            IAppNotifier appNotifier,
            IWebUrlService webUrlService,
            AbpLoginResultTypeHelper abpLoginResultTypeHelper,
            IUserLinkManager userLinkManager,
            LogInManager logInManager,
            SignInManager signInManager,
            IRecaptchaValidator recaptchaValidator,
            ITenantCache tenantCache,
            IAccountAppService accountAppService,
            UserRegistrationManager userRegistrationManager,
            IImpersonationManager impersonationManager,
            IAppUrlService appUrlService,
            IPerRequestSessionCache sessionCache,
            IEmailSender emailSender,
            ISmsSender smsSender,
            IPasswordComplexitySettingStore passwordComplexitySettingStore,
            IOptions<IdentityOptions> identityOptions,
            ISessionAppService sessionAppService,
            ExternalLoginInfoManagerFactory externalLoginInfoManagerFactory,
            ISettingManager settingManager,
            IUserDelegationManager userDelegationManager,
            IBackgroundJobManager backgroundJobManager)
        {
			_profileAppService = profileAppService;
			_webHostEnvironment = webHostEnvironment;
			_userRepository = userRepository;
			_userAppService = userAppService;
			_userManager = userManager;
            _multiTenancyConfig = multiTenancyConfig;
            _tenantManager = tenantManager;
            _unitOfWorkManager = unitOfWorkManager;
            _webUrlService = webUrlService;
            _appNotifier = appNotifier;
            _abpLoginResultTypeHelper = abpLoginResultTypeHelper;
            _userLinkManager = userLinkManager;
            _logInManager = logInManager;
            _signInManager = signInManager;
            _recaptchaValidator = recaptchaValidator;
            _tenantCache = tenantCache;
            _accountAppService = accountAppService;
            _userRegistrationManager = userRegistrationManager;
            _impersonationManager = impersonationManager;
            _appUrlService = appUrlService;
            _sessionCache = sessionCache;
            _emailSender = emailSender;
            _smsSender = smsSender;
            _passwordComplexitySettingStore = passwordComplexitySettingStore;
            _identityOptions = identityOptions.Value;
            _sessionAppService = sessionAppService;
            _externalLoginInfoManagerFactory = externalLoginInfoManagerFactory;
            _settingManager = settingManager;
            _userDelegationManager = userDelegationManager;
            _backgroundJobManager = backgroundJobManager;

        }

        #region Login / Logout

        public async Task<ActionResult> Login(string userNameOrEmailAddress = "", string returnUrl = "", string successMessage = "", string ss = "")
        {
          returnUrl = NormalizeReturnUrl(returnUrl);

            if (!string.IsNullOrEmpty(ss) && ss.Equals("true", StringComparison.OrdinalIgnoreCase) && AbpSession.UserId > 0)
            {
                var updateUserSignInTokenOutput = await _sessionAppService.UpdateUserSignInToken();
                returnUrl = AddSingleSignInParametersToReturnUrl(returnUrl, updateUserSignInTokenOutput.SignInToken, AbpSession.UserId.Value, AbpSession.TenantId);
                return Redirect(returnUrl);
            }

            ViewBag.ReturnUrl = returnUrl;
            ViewBag.IsMultiTenancyEnabled = _multiTenancyConfig.IsEnabled;
            ViewBag.SingleSignIn = ss;
            ViewBag.UseCaptcha = UseCaptchaOnLogin();
            ViewBag.IsRegImage = false;

            return View(
                new LoginFormViewModel
                {
                    IsSelfRegistrationEnabled = IsSelfRegistrationEnabled(),
                    IsTenantSelfRegistrationEnabled = IsTenantSelfRegistrationEnabled(),
                    SuccessMessage = successMessage,
                    UserNameOrEmailAddress = userNameOrEmailAddress
				});
        }

        public async Task<ActionResult> BusinessSupportLogin(string userNameOrEmailAddress = "", string returnUrl = "", string successMessage = "", string ss = "")
        {
            HttpContext.Session.SetString("Source", "BS");

            return RedirectToAction("Login", new { userNameOrEmailAddress, returnUrl, successMessage, ss });
        }

        public async Task<ActionResult> FinanceLogin(string userNameOrEmailAddress = "", string returnUrl = "", string successMessage = "", string ss = "")
        {
            HttpContext.Session.SetString("Source", "");

            return RedirectToAction("Login", new { userNameOrEmailAddress, returnUrl, successMessage, ss });
        }

		public async Task<ActionResult> UserInactiveReactivate(int userId)
		{
			using(CurrentUnitOfWork.SetTenantId(AbpSession.TenantId))
            {
				var user = _userManager.GetUserById(userId);
				if(user.PropertiesJson != null)
                {
					var json = JsonConvert.DeserializeObject<dynamic>(user.PropertiesJson);
					if(json["user-revoked"] != null)
					{
						json["user-revoked"]["warning-sent"] = false;
						json["user-revoked"]["revocation-sent"] = false;
						user.PropertiesJson = JsonConvert.SerializeObject(json);
					}
				}
				user.IsActive = true;
				_userRepository.Update(user);
				CurrentUnitOfWork.SaveChanges();
			}
			return RedirectToAction("Login", "Account");
		}

		public ActionResult UserInactive(int userId)
		{
			var user = _userManager.GetUserById(userId);
			return View("UserInactive", user);
		}

		private bool HasUserBeenRevoked(
			string userEmailAddress,
			string userPassword,
			ref User userRef
		)
		{
			using(CurrentUnitOfWork.SetTenantId(AbpSession.TenantId))
			{
				var temp = _userAppService.GetUserByTenantAndEmailAndPassword((int)AbpSession.TenantId, userEmailAddress, userPassword);
				User user = temp.Result;
				if(user != null)
				{
					userRef = user;
					if(user.PropertiesJson != null && user.IsActive == true)
					{
						var json = JsonConvert.DeserializeObject<dynamic>(user.PropertiesJson);
						if(json["user-revoked"] != null)
						{
							if(json["user-revoked"]["warning-sent"] == true)
							{
								json["user-revoked"]["warning-sent"] = false;
								user.PropertiesJson = JsonConvert.SerializeObject(json);
								_userRepository.Update(user);
								CurrentUnitOfWork.SaveChanges();
							}
						}
					}
					return (
						user.IsActive == false &&
						user.IsEmailConfirmed == true
					);
				}
				else
				{
					return false;
				}
			}
		}

		[HttpPost]
        [UnitOfWork]
        public virtual async Task<JsonResult> Login(LoginViewModel loginModel, string returnUrl = "", string returnUrlHash = "", string ss = "")
        {
            returnUrl = NormalizeReturnUrl(returnUrl);
            if (!string.IsNullOrWhiteSpace(returnUrlHash))
            {
                returnUrl += returnUrlHash;
            }

			User user = null;
			bool userRevoked = AbpSession.TenantId != null && HasUserBeenRevoked(loginModel.UsernameOrEmailAddress, loginModel.Password, ref user) ;
			if(userRevoked == true )
			{
				//return Json(new AjaxResponse(new ErrorInfo((int)user.Id, "UserInactive", AbpSession.TenantId.ToString())));
				var jsonObj = new { userId = user.Id, tenantId = AbpSession.TenantId, verb = "UserInactive" };
				return Json(jsonObj);
				//string enc = SimpleStringCipher.Instance.Encrypt(jsonStr);
			}

			if (UseCaptchaOnLogin())
            {
                await _recaptchaValidator.ValidateAsync(HttpContext.Request.Form[RecaptchaValidator.RecaptchaResponseKey]);
            }

            var loginResult = await GetLoginResultAsync(loginModel.UsernameOrEmailAddress, loginModel.Password, GetTenancyNameOrNull());

			if(loginResult.Result == AbpLoginResultType.UserEmailIsNotConfirmed)
			{
				return Json(new AjaxResponse(new ErrorInfo("UserEmailIsNotConfirmed", AbpSession.TenantId.ToString())));
			}


            if (!string.IsNullOrEmpty(ss) && ss.Equals("true", StringComparison.OrdinalIgnoreCase) && loginResult.Result == AbpLoginResultType.Success)
            {
                loginResult.User.SetSignInToken();
                returnUrl = AddSingleSignInParametersToReturnUrl(returnUrl, loginResult.User.SignInToken, loginResult.User.Id, loginResult.User.TenantId);
            }

            //if (!string.IsNullOrEmpty(singletonSource.GetSource()))
            //{
            //    returnUrl = BusinessSupportUrl;
            //}

            if (!string.IsNullOrEmpty(HttpContext.Session.GetString("Source")))
            {
                if (HttpContext.Session.GetString("Source") == "BS")
                { 
                    returnUrl = BusinessSupportUrl;
                }
            }

            if (_settingManager.GetSettingValue<bool>(AppSettings.UserManagement.AllowOneConcurrentLoginPerUser))
            {
                await _userManager.UpdateSecurityStampAsync(loginResult.User);
            }

            if (loginResult.User.ShouldChangePasswordOnNextLogin)
            {
                loginResult.User.SetNewPasswordResetCode();

                return Json(new AjaxResponse
                {
                    TargetUrl = Url.Action(
                        "ResetPassword",
                        new ResetPasswordViewModel
                        {
                            TenantId = AbpSession.TenantId,
                            UserId = loginResult.User.Id,
                            ResetCode = loginResult.User.PasswordResetCode,
                            ReturnUrl = returnUrl,
                            SingleSignIn = ss
                        })
                });
            }

            var signInResult = await _signInManager.SignInOrTwoFactorAsync(loginResult, loginModel.RememberMe);
            if (signInResult.RequiresTwoFactor)
            {
                return Json(new AjaxResponse
                {
                    TargetUrl = Url.Action(
                        "SendSecurityCode",
                        new
                        {
                            returnUrl = returnUrl,
                            rememberMe = loginModel.RememberMe
                        })
                });
            }

            Debug.Assert(signInResult.Succeeded);

            await UnitOfWorkManager.Current.SaveChangesAsync();

            if (!string.IsNullOrEmpty(HttpContext.Session.GetString("Source")) && HttpContext.Session.GetString("Source") == "BS")
            //if (!string.IsNullOrEmpty(singletonSource.GetSource()))
            {
                return Json(new AjaxResponse { TargetUrl = Url.Action("BusinessSupport", "ECDCbusinessSupport") });

            }
            else
            {
                return Json(new AjaxResponse { TargetUrl = returnUrl });
            }
        }

        public async Task<ActionResult> Logout(string returnUrl = "")
        {
            await _signInManager.SignOutAsync();
            var userIdentifier = AbpSession.ToUserIdentifier();

            if (userIdentifier != null && _settingManager.GetSettingValue<bool>(AppSettings.UserManagement.AllowOneConcurrentLoginPerUser))
            {
                var user = await _userManager.GetUserAsync(userIdentifier);
                await _userManager.UpdateSecurityStampAsync(user);
            }

            if (!string.IsNullOrEmpty(returnUrl))
            {
                returnUrl = NormalizeReturnUrl(returnUrl);
                return Redirect(returnUrl);
            }

            return RedirectToAction("Login");
        }

        private async Task<AbpLoginResult<Tenant, User>> GetLoginResultAsync(string usernameOrEmailAddress, string password, string tenancyName)
        {
            var loginResult = await _logInManager.LoginAsync(usernameOrEmailAddress, password, tenancyName);

            switch (loginResult.Result)
            {
                case AbpLoginResultType.Success:
				case AbpLoginResultType.UserEmailIsNotConfirmed:
					return loginResult;

                default:
                    throw _abpLoginResultTypeHelper.CreateExceptionForFailedLoginAttempt(loginResult.Result, usernameOrEmailAddress, tenancyName);
            }
        }

        private string AddSingleSignInParametersToReturnUrl(string returnUrl, string signInToken, long userId, int? tenantId)
        {
            returnUrl += (returnUrl.Contains("?") ? "&" : "?") +
                         "accessToken=" + signInToken +
                         "&userId=" + Convert.ToBase64String(Encoding.UTF8.GetBytes(userId.ToString()));
            if (tenantId.HasValue)
            {
                returnUrl += "&tenantId=" + Convert.ToBase64String(Encoding.UTF8.GetBytes(tenantId.Value.ToString()));
            }

            return returnUrl;
        }

        public ActionResult SessionLockScreen()
        {
            ViewBag.UseCaptcha = UseCaptchaOnLogin();
            return View();
        }

        #endregion

        #region Two Factor Auth

        public async Task<ActionResult> SendSecurityCode(string returnUrl, bool rememberMe = false)
        {
            var user = await _signInManager.GetTwoFactorAuthenticationUserAsync();
            if (user == null)
            {
                return RedirectToAction("Login");
            }

            CheckCurrentTenant(await _signInManager.GetVerifiedTenantIdAsync());

            var userProviders = await _userManager.GetValidTwoFactorProvidersAsync(user);

            var factorOptions = userProviders.Select(
                userProvider =>
                    new SelectListItem
                    {
                        Text = userProvider,
                        Value = userProvider
                    }).ToList();

            return View(
                new SendSecurityCodeViewModel
                {
                    Providers = factorOptions,
                    ReturnUrl = returnUrl,
                    RememberMe = rememberMe
                }
            );
        }

        [HttpPost]
        public async Task<ActionResult> SendSecurityCode(SendSecurityCodeViewModel model)
        {
            var user = await _signInManager.GetTwoFactorAuthenticationUserAsync();
            if (user == null)
            {
                return RedirectToAction("Login");
            }

            CheckCurrentTenant(await _signInManager.GetVerifiedTenantIdAsync());

            if (model.SelectedProvider != GoogleAuthenticatorProvider.Name)
            {
                var code = await _userManager.GenerateTwoFactorTokenAsync(user, model.SelectedProvider);
                var message = L("EmailSecurityCodeBody", code);

                if (model.SelectedProvider == "Email")
                {
                    await _emailSender.SendAsync(await _userManager.GetEmailAsync(user), L("EmailSecurityCodeSubject"), message);
                }
                else if (model.SelectedProvider == "Phone")
                {
                    await _smsSender.SendAsync(await _userManager.GetPhoneNumberAsync(user), message);
                }
            }

            return RedirectToAction(
                "VerifySecurityCode",
                new
                {
                    provider = model.SelectedProvider,
                    returnUrl = model.ReturnUrl,
                    rememberMe = model.RememberMe
                }
            );
        }

        public async Task<ActionResult> VerifySecurityCode(string provider, string returnUrl, bool rememberMe)
        {
            var user = await _signInManager.GetTwoFactorAuthenticationUserAsync();
            if (user == null)
            {
                throw new UserFriendlyException(L("VerifySecurityCodeNotLoggedInErrorMessage"));
            }

            CheckCurrentTenant(await _signInManager.GetVerifiedTenantIdAsync());

            var isRememberBrowserEnabled = await IsRememberBrowserEnabledAsync();

            return View(
                new VerifySecurityCodeViewModel
                {
                    Provider = provider,
                    ReturnUrl = returnUrl,
                    RememberMe = rememberMe,
                    IsRememberBrowserEnabled = isRememberBrowserEnabled
                }
            );
        }

        [HttpPost]
        public async Task<JsonResult> VerifySecurityCode(VerifySecurityCodeViewModel model)
        {
            model.ReturnUrl = NormalizeReturnUrl(model.ReturnUrl);

            CheckCurrentTenant(await _signInManager.GetVerifiedTenantIdAsync());

            var result = await _signInManager.TwoFactorSignInAsync(
                model.Provider,
                model.Code,
                model.RememberMe,
                await IsRememberBrowserEnabledAsync() && model.RememberBrowser
            );

            if (result.Succeeded)
            {
                return Json(new AjaxResponse { TargetUrl = model.ReturnUrl });
            }

            if (result.IsLockedOut)
            {
                throw new UserFriendlyException(L("UserLockedOutMessage"));
            }

            throw new UserFriendlyException(L("InvalidSecurityCode"));
        }

        private Task<bool> IsRememberBrowserEnabledAsync()
        {
            return SettingManager.GetSettingValueAsync<bool>(AbpZeroSettingNames.UserManagement.TwoFactorLogin.IsRememberBrowserEnabled);
        }

        #endregion

        #region Register

        public async Task<ActionResult> Register(string returnUrl = "", string ss = "", string successMessage = "", string origin = "")
        {
            ViewBag.IsRegImage = true;

            return RegisterView(new RegisterViewModel
            {
                PasswordComplexitySetting = await _passwordComplexitySettingStore.GetSettingsAsync(),
                ReturnUrl = returnUrl,
                SingleSignIn = ss,
                UserMessage = successMessage,
                Origin = origin
            });
        }

        private ActionResult RegisterView(RegisterViewModel model)
        {
            CheckSelfRegistrationIsEnabled();

            ViewBag.UseCaptcha = !model.IsExternalLogin && UseCaptchaOnRegistration();

            return View("Register", model);
        }

        [HttpPost]
        [UnitOfWork(IsolationLevel.ReadUncommitted)]
        public async Task<ActionResult> Register(RegisterViewModel model)
        {
            try
            {
                //Singleton1 singletonSource = Singleton1.Instance();
                string source = null;
                //if (!string.IsNullOrEmpty(singletonSource.GetSource()))
                //{
                //    source = singletonSource.GetSource();
                //}

                if (!string.IsNullOrEmpty(HttpContext.Session.GetString("Source")))
                {
                    source = HttpContext.Session.GetString("Source");
                }


                if (!model.IsExternalLogin && UseCaptchaOnRegistration())
                {
                    await _recaptchaValidator.ValidateAsync(HttpContext.Request.Form[RecaptchaValidator.RecaptchaResponseKey]);
                }

                ExternalLoginInfo externalLoginInfo = null;
                if (model.IsExternalLogin)
                {
                    externalLoginInfo = await _signInManager.GetExternalLoginInfoAsync();
                    if (externalLoginInfo == null)
                    {
                        throw new Exception("Can not external login!");
                    }

                    using (var providerManager = _externalLoginInfoManagerFactory.GetExternalLoginInfoManager(externalLoginInfo.LoginProvider))
                    {
                        model.UserName = providerManager.Object.GetUserNameFromClaims(externalLoginInfo.Principal.Claims.ToList());
                    }

                    model.Password = await _userManager.CreateRandomPassword();
                }
                else
                {
                    // setting UserName to EmailAddress to simplify client registration for non-external
                    model.UserName = model.EmailAddress;

                    if (model.UserName.IsNullOrEmpty() || model.Password.IsNullOrEmpty() || model.PhoneNumber.IsNullOrEmpty())
                    {
                        throw new UserFriendlyException(L("FormIsNotValidMessage"));
                    }
                }

                var user = await _userRegistrationManager.RegisterAsync(
                    model.Name,
                    model.Surname,
                    model.EmailAddress,
                    model.EmailAddress, // replaced model.Username with EmailAddress
                    model.Password,
                    false,
                    _appUrlService.CreateEmailActivationUrlFormat(AbpSession.TenantId, source), // _appUrlService.CreateEmailActivationUrlFormat(AbpSession.TenantId),
                    model.Origin,
                    model.PhoneNumber.Replace(" ", ""),
                    source
                );

                // queue the job to add user to crm
                await _backgroundJobManager.EnqueueAsync<HubSpotEventTriggerBackgroundJob, HubSpotEventTriggerDto>(new HubSpotEventTriggerDto()
                {
                    TenantId = (int)AbpSession.TenantId,
                    UserId = user.Id,
                    EventType = HubSpotEventTypes.CreateEdit,
                    HSEntityType = HubSpotEntityTypes.contacts,
                    UserJourneyPoint = UserJourneyContextTypes.NewUserRegistration
                }, BackgroundJobPriority.Normal, new TimeSpan(0, 0, 5));

                //Getting tenant-specific settings
                var isEmailConfirmationRequiredForLogin = await SettingManager.GetSettingValueAsync<bool>(AbpZeroSettingNames.UserManagement.IsEmailConfirmationRequiredForLogin);

                if (model.IsExternalLogin)
                {
                    Debug.Assert(externalLoginInfo != null);

                    if (string.Equals(externalLoginInfo.Principal.FindFirstValue(ClaimTypes.Email), model.EmailAddress, StringComparison.OrdinalIgnoreCase))
                    {
                        user.IsEmailConfirmed = false;
                    }

                    user.Logins = new List<UserLogin>
                    {
                        new UserLogin
                        {
                            LoginProvider = externalLoginInfo.LoginProvider,
                            ProviderKey = externalLoginInfo.ProviderKey,
                            TenantId = user.TenantId
                        }
                    };
                }

                await _unitOfWorkManager.Current.SaveChangesAsync();

                Debug.Assert(user.TenantId != null);

                var tenant = await _tenantManager.GetByIdAsync(user.TenantId.Value);

                //Directly login if possible
                if (user.IsActive && (user.IsEmailConfirmed || !isEmailConfirmationRequiredForLogin))
                {
                    AbpLoginResult<Tenant, User> loginResult;
                    if (externalLoginInfo != null)
                    {
                        loginResult = await _logInManager.LoginAsync(externalLoginInfo, tenant.TenancyName);
                    }
                    else
                    {
                        loginResult = await GetLoginResultAsync(user.UserName, model.Password, tenant.TenancyName);
                    }

                    if (loginResult.Result == AbpLoginResultType.Success)
                    {
                        await _signInManager.SignInAsync(loginResult.Identity, false);
                        if (!string.IsNullOrEmpty(model.SingleSignIn) && model.SingleSignIn.Equals("true", StringComparison.OrdinalIgnoreCase) && loginResult.Result == AbpLoginResultType.Success)
                        {
                            var returnUrl = NormalizeReturnUrl(model.ReturnUrl);
                            loginResult.User.SetSignInToken();
                            returnUrl = AddSingleSignInParametersToReturnUrl(returnUrl, loginResult.User.SignInToken, loginResult.User.Id, loginResult.User.TenantId);
                            return Redirect(returnUrl);
                        }

                        return Redirect(GetAppHomeUrl());
                    }

                    Logger.Warn("New registered user could not be login. This should not be normally. login result: " + loginResult.Result);
                }

                return View("RegisterResult", new RegisterResultViewModel
                {
                    TenancyName = tenant.TenancyName,
                    NameAndSurname = user.Name + " " + user.Surname,
                    UserName = user.EmailAddress, // replaced user.UserName with user.EmailAddress
                    EmailAddress = user.EmailAddress,
                    IsActive = user.IsActive,
                    IsEmailConfirmationRequired = isEmailConfirmationRequiredForLogin
                });
            }
            catch (UserFriendlyException ex)
            {
                ViewBag.UseCaptcha = !model.IsExternalLogin && UseCaptchaOnRegistration();
                ViewBag.ErrorMessage = ex.Message;

                model.PasswordComplexitySetting = await _passwordComplexitySettingStore.GetSettingsAsync();

                return View("Register", model);
            }
        }

        private bool UseCaptchaOnRegistration()
        {
            if (!AbpSession.TenantId.HasValue)
            {
                //Host users can not register
                throw new InvalidOperationException();
            }

            return SettingManager.GetSettingValue<bool>(AppSettings.UserManagement.UseCaptchaOnRegistration);
        }

        private bool UseCaptchaOnLogin()
        {
            return SettingManager.GetSettingValue<bool>(AppSettings.UserManagement.UseCaptchaOnLogin);
        }

        private void CheckSelfRegistrationIsEnabled()
        {
            if (!IsSelfRegistrationEnabled())
            {
                throw new UserFriendlyException(L("SelfUserRegistrationIsDisabledMessage_Detail"));
            }
        }

        private bool IsSelfRegistrationEnabled()
        {
            if (!AbpSession.TenantId.HasValue)
            {
                return false; //No registration enabled for host users!
            }

            return SettingManager.GetSettingValue<bool>(AppSettings.UserManagement.AllowSelfRegistration);
        }

        private bool IsTenantSelfRegistrationEnabled()
        {
            if (AbpSession.TenantId.HasValue)
            {
                return false;
            }

            return SettingManager.GetSettingValue<bool>(AppSettings.TenantManagement.AllowSelfRegistration);
        }

        #endregion

        #region ForgotPassword / ResetPassword

        public ActionResult ForgotPassword()
        {
            return View();
        }

        [HttpPost]
        public async Task<JsonResult> SendPasswordResetLink(SendPasswordResetLinkViewModel model)
        {
            await _accountAppService.SendPasswordResetCode(
                new SendPasswordResetCodeInput
                {
                    EmailAddress = model.EmailAddress
                });

            return Json(new AjaxResponse());
        }

        public async Task<ActionResult> ResetPassword(ResetPasswordViewModel model)
        {
            await SwitchToTenantIfNeeded(model.TenantId);

            var user = await _userManager.GetUserByIdAsync(model.UserId);
            if (user == null || user.PasswordResetCode.IsNullOrEmpty() || user.PasswordResetCode != model.ResetCode)
            {
                throw new UserFriendlyException(L("InvalidPasswordResetCode"), L("InvalidPasswordResetCode_Detail"));
            }

            model.PasswordComplexitySetting = await _passwordComplexitySettingStore.GetSettingsAsync();

            return View(model);
        }

        [HttpPost]
        public async Task<ActionResult> ResetPassword(ResetPasswordInput input)
        {
            var output = await _accountAppService.ResetPassword(input);

            if (output.CanLogin)
            {
                var user = await _userManager.GetUserByIdAsync(input.UserId);
                await _signInManager.SignInAsync(user, false);

                if (!string.IsNullOrEmpty(input.SingleSignIn) && input.SingleSignIn.Equals("true", StringComparison.OrdinalIgnoreCase))
                {
                    user.SetSignInToken();
                    var returnUrl = AddSingleSignInParametersToReturnUrl(input.ReturnUrl, user.SignInToken, user.Id, user.TenantId);
                    return Redirect(returnUrl);
                }
            }

            return Redirect(NormalizeReturnUrl(input.ReturnUrl));
        }

        #endregion

        #region Email activation / confirmation

        public ActionResult EmailActivation()
        {
            return View();
        }

        [HttpPost]
        [UnitOfWork]
        public virtual async Task<JsonResult> SendEmailActivationLink(SendEmailActivationLinkInput model)
        {
            await _accountAppService.SendEmailActivationLink(model);
            return Json(new AjaxResponse());
        }

        [UnitOfWork]
        public virtual async Task<ActionResult> EmailConfirmation(EmailConfirmationViewModel input)
        {
            await SwitchToTenantIfNeeded(input.TenantId);
            await _accountAppService.ActivateEmail(input);

            if(!string.IsNullOrWhiteSpace(input.Source) && input.Source == "BS")
            {
                return RedirectToAction("BusinessSupportLogin", new { successMessage = L("YourEmailIsConfirmedMessage"), userNameOrEmailAddress = (await _userManager.GetUserByIdAsync(input.UserId)).UserName });
            }

            return RedirectToAction( "FinanceLogin", new { successMessage = L("YourEmailIsConfirmedMessage"), userNameOrEmailAddress = (await _userManager.GetUserByIdAsync(input.UserId)).UserName });
        }

        #endregion

        #region External Login

        [HttpPost]
        public ActionResult ExternalLogin(string provider, string returnUrl, string ss = "")
        {
            var redirectUrl = Url.Action(
                "ExternalLoginCallback",
                "Account",
                new
                {
                    ReturnUrl = returnUrl,
                    authSchema = provider,
                    ss = ss
                });

            var properties = _signInManager.ConfigureExternalAuthenticationProperties(provider, redirectUrl);

            return Challenge(properties, provider);
        }

        [UnitOfWork]
        public virtual async Task<ActionResult> ExternalLoginCallback(string returnUrl, string remoteError = null, string ss = "")
        {
            returnUrl = NormalizeReturnUrl(returnUrl);

            if (remoteError != null)
            {
                Logger.Error("Remote Error in ExternalLoginCallback: " + remoteError);
                throw new UserFriendlyException(L("CouldNotCompleteLoginOperation"));
            }

            var externalLoginInfo = await _signInManager.GetExternalLoginInfoAsync();
            if (externalLoginInfo == null)
            {
                Logger.Warn("Could not get information from external login.");
                return RedirectToAction(nameof(Login));
            }

            var tenancyName = GetTenancyNameOrNull();

            var loginResult = await _logInManager.LoginAsync(externalLoginInfo, tenancyName);

            switch (loginResult.Result)
            {
                case AbpLoginResultType.Success:
                    {
                        await _signInManager.SignInAsync(loginResult.Identity, false);

                        if (!string.IsNullOrEmpty(ss) && ss.Equals("true", StringComparison.OrdinalIgnoreCase) && loginResult.Result == AbpLoginResultType.Success)
                        {
                            loginResult.User.SetSignInToken();
                            returnUrl = AddSingleSignInParametersToReturnUrl(returnUrl, loginResult.User.SignInToken, loginResult.User.Id, loginResult.User.TenantId);
                        }

                        return Redirect(returnUrl);
                    }
                case AbpLoginResultType.UnknownExternalLogin:
                    return await RegisterForExternalLogin(externalLoginInfo);
                default:
                    throw _abpLoginResultTypeHelper.CreateExceptionForFailedLoginAttempt(
                        loginResult.Result,
                        externalLoginInfo.Principal.FindFirstValue(ClaimTypes.Email) ?? externalLoginInfo.ProviderKey,
                        tenancyName
                    );
            }
        }

        private async Task<ActionResult> RegisterForExternalLogin(ExternalLoginInfo externalLoginInfo)
        {
            var email = externalLoginInfo.Principal.FindFirstValue(ClaimTypes.Email);
            var phoneNumber = externalLoginInfo.Principal.FindFirstValue(ClaimTypes.MobilePhone);

            (string name, string surname) nameInfo;
            using (var providerManager = _externalLoginInfoManagerFactory.GetExternalLoginInfoManager(externalLoginInfo.LoginProvider))
            {
                nameInfo = providerManager.Object.GetNameAndSurnameFromClaims(externalLoginInfo.Principal.Claims.ToList(), _identityOptions);
            }

            var viewModel = new RegisterViewModel
            {
                EmailAddress = email,
                Name = nameInfo.name,
                PhoneNumber = phoneNumber,
                Surname = nameInfo.surname,
                IsExternalLogin = true,
                ExternalLoginAuthSchema = externalLoginInfo.LoginProvider
            };


            if (nameInfo.name != null &&
                nameInfo.surname != null &&
                email != null &&
                phoneNumber != null)
            {
                return await Register(viewModel);
            }

            return RegisterView(viewModel);
        }

        #endregion

        #region Impersonation

        [AbpMvcAuthorize(AppPermissions.Pages_Administration_Users_Impersonation)]
        public virtual async Task<JsonResult> Impersonate([FromBody] ImpersonateInput input)
        {
            var output = await _accountAppService.Impersonate(input);

            await _signInManager.SignOutAsync();

            return Json(new AjaxResponse
            {
                TargetUrl = _webUrlService.GetSiteRootAddress(output.TenancyName) + "Account/ImpersonateSignIn?tokenId=" + output.ImpersonationToken
            });
        }

        [UnitOfWork]
        public virtual async Task<ActionResult> ImpersonateSignIn(string tokenId)
        {
            var result = await _impersonationManager.GetImpersonatedUserAndIdentity(tokenId);
            await _signInManager.SignInAsync(result.Identity, false);
            return RedirectToAppHome();
        }

        [AbpMvcAuthorize]
        public virtual async Task<JsonResult> DelegatedImpersonate([FromBody]DelegatedImpersonateInput input)
        {
            var userDelegation = await _userDelegationManager.GetAsync(input.UserDelegationId);
            if (userDelegation.TargetUserId != AbpSession.GetUserId())
            {
                throw new UserFriendlyException("User delegation error...");
            }

            var output = await _accountAppService.Impersonate(new ImpersonateInput
            {
                TenantId = AbpSession.TenantId,
                UserId = userDelegation.SourceUserId
            });

            await _signInManager.SignOutAsync();

            return Json(new AjaxResponse
            {
                TargetUrl = _webUrlService.GetSiteRootAddress(output.TenancyName) + "Account/DelegatedImpersonateSignIn?userDelegationId=" + input.UserDelegationId + "&tokenId=" + output.ImpersonationToken
            });
        }

        [UnitOfWork]
        public virtual async Task<ActionResult> DelegatedImpersonateSignIn(long userDelegationId, string tokenId)
        {
            var userDelegation = await _userDelegationManager.GetAsync(userDelegationId);
            var result = await _impersonationManager.GetImpersonatedUserAndIdentity(tokenId);

            if (userDelegation.SourceUserId != result.User.Id)
            {
                throw new UserFriendlyException("User delegation error...");
            }

            await _signInManager.SignInWithClaimsAsync(result.User, new AuthenticationProperties
            {
                IsPersistent = true,
                ExpiresUtc = userDelegation.EndTime.ToUniversalTime()
            }, result.Identity.Claims);

            return RedirectToAppHome();
        }

        public virtual JsonResult IsImpersonatedLogin()
        {
            return Json(new AjaxResponse { Result = AbpSession.ImpersonatorUserId.HasValue });
        }

        public virtual async Task<JsonResult> BackToImpersonator()
        {
            var output = await _accountAppService.BackToImpersonator();

            await _signInManager.SignOutAsync();

            return Json(new AjaxResponse
            {
                TargetUrl = _webUrlService.GetSiteRootAddress(output.TenancyName) + "Account/ImpersonateSignIn?tokenId=" + output.ImpersonationToken
            });
        }

        #endregion

        #region Linked Account

        [UnitOfWork]
        [AbpMvcAuthorize]
        public virtual async Task<JsonResult> SwitchToLinkedAccount([FromBody] SwitchToLinkedAccountInput model)
        {
            var output = await _accountAppService.SwitchToLinkedAccount(model);

            await _signInManager.SignOutAsync();

            return Json(new AjaxResponse
            {
                TargetUrl = _webUrlService.GetSiteRootAddress(output.TenancyName) + "Account/SwitchToLinkedAccountSignIn?tokenId=" + output.SwitchAccountToken
            });
        }

        [UnitOfWork]
        public virtual async Task<ActionResult> SwitchToLinkedAccountSignIn(string tokenId)
        {
            var result = await _userLinkManager.GetSwitchedUserAndIdentity(tokenId);

            await _signInManager.SignInAsync(result.Identity, false);
            return RedirectToAppHome();
        }

        #endregion

        #region Change Tenant

        public async Task<ActionResult> TenantChangeModal()
        {
            var loginInfo = await _sessionCache.GetCurrentLoginInformationsAsync();
            var tenancyNames = _tenantManager.GetAllTenancyNames();
            return View("/Views/Shared/Components/TenantChange/_ChangeModal.cshtml", new ChangeModalViewModel
            {
                TenancyName = loginInfo.Tenant?.TenancyName,
                TenancyNames = tenancyNames
            });
        }

        #endregion

        #region Common

        private string GetTenancyNameOrNull()
        {
            if (!AbpSession.TenantId.HasValue)
            {
                return null;
            }

            return _tenantCache.GetOrNull(AbpSession.TenantId.Value)?.TenancyName;
        }

        private void CheckCurrentTenant(int? tenantId)
        {
            if (AbpSession.TenantId != tenantId)
            {
                throw new Exception($"Current tenant is different than given tenant. AbpSession.TenantId: {AbpSession.TenantId}, given tenantId: {tenantId}");
            }
        }

        private async Task SwitchToTenantIfNeeded(int? tenantId)
        {
            if (tenantId != AbpSession.TenantId)
            {
                if (_webUrlService.SupportsTenancyNameInUrl)
                {
                    throw new InvalidOperationException($"Given tenantid ({tenantId}) does not match to tenant's URL!");
                }

                SetTenantIdCookie(tenantId);
                CurrentUnitOfWork.SetTenantId(tenantId);
                await _signInManager.SignOutAsync();
            }
        }

        #endregion

        #region Helpers

        public ActionResult RedirectToAppHome()
        {
            return RedirectToAction("Index", "Home", new { area = "App" });
        }

        public string GetAppHomeUrl()
        {
            return Url.Action("Index", "Home", new { area = "App" });
        }

        private string NormalizeReturnUrl(string returnUrl, Func<string> defaultValueBuilder = null)
        {
            if (defaultValueBuilder == null)
            {
                defaultValueBuilder = GetAppHomeUrl;
            }

            if (returnUrl.IsNullOrEmpty())
            {
                return defaultValueBuilder();
            }

            if (Url.IsLocalUrl(returnUrl) || _webUrlService.GetRedirectAllowedExternalWebSites().Any(returnUrl.Contains))
            {
                return returnUrl;
            }

            return defaultValueBuilder();
        }

        #endregion

        #region Etc

        [AbpMvcAuthorize]
        public async Task<ActionResult> TestNotification(string message = "", string severity = "info")
        {
            if (message.IsNullOrEmpty())
            {
                message = "This is a test notification, created at " + Clock.Now;
            }

            await _appNotifier.SendMessageAsync(
                AbpSession.ToUserIdentifier(),
                message,
                severity.ToPascalCase().ToEnum<NotificationSeverity>()
                );

            return Content("Sent notification: " + message);
        }

        #endregion
    }
}
