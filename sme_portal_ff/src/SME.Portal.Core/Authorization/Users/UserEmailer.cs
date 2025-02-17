using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Abp.Authorization.Users;
using Abp.Configuration;
using Abp.Dependency;
using Abp.Domain.Repositories;
using Abp.Domain.Uow;
using Abp.Extensions;
using Abp.Localization;
using Abp.Net.Mail;
using SME.Portal.Chat;
using SME.Portal.Editions;
using SME.Portal.Localization;
using SME.Portal.MultiTenancy;
using System.Net.Mail;
using System.Web;
using Abp.Runtime.Security;
using SME.Portal.Net.Emailing;
using SME.Portal.SME.Dtos;
using SME.Portal.Lenders;
using System.Linq;
using Abp.Runtime.Session;

namespace SME.Portal.Authorization.Users
{
    /// <summary>
    /// Used to send email to users.
    /// </summary>
    public class UserEmailer : PortalServiceBase, IUserEmailer, ITransientDependency
    {
        private readonly IEmailTemplateProvider _emailTemplateProvider;
        private readonly IEmailSender _emailSender;
        private readonly IRepository<Tenant> _tenantRepository;
        private readonly ICurrentUnitOfWorkProvider _unitOfWorkProvider;
        private readonly IUnitOfWorkManager _unitOfWorkManager;
        private readonly ISettingManager _settingManager;
        private readonly EditionManager _editionManager;
        private readonly UserManager _userManager;

        private const int FinfindTenantId = 2;
        private const int SefaTenantId = 3;
        private const int EcdcTenantId = 5;
		private const int CompanyPartnersTenantId = 9;
		private const int AfricanBankTenantId = 10;
		private const int HlooloTenantId = 12;

		// used for styling action links on email messages.
		private string _emailButtonStyle =
            "padding-left: 30px; padding-right: 30px; padding-top: 12px; padding-bottom: 12px; color: #ffffff; background-color: #00bb77; font-size: 14pt; text-decoration: none;";
        private string _emailButtonColor = "#00bb77";

		private readonly IAbpSession _abpSession;

        public UserEmailer(
            IEmailTemplateProvider emailTemplateProvider,
            IEmailSender emailSender,
            IRepository<Tenant> tenantRepository,
            ICurrentUnitOfWorkProvider unitOfWorkProvider,
            IUnitOfWorkManager unitOfWorkManager,
            ISettingManager settingManager,
            EditionManager editionManager,
            UserManager userManager,
			IAbpSession abpSession
		)
        {
            _emailTemplateProvider = emailTemplateProvider;
            _emailSender = emailSender;
            _tenantRepository = tenantRepository;
            _unitOfWorkProvider = unitOfWorkProvider;
            _unitOfWorkManager = unitOfWorkManager;
            _settingManager = settingManager;
            _editionManager = editionManager;
            _userManager = userManager;
			_abpSession = abpSession;
		}



        /// <summary>
        /// Send email activation link to user's email address.
        /// </summary>
        /// <param name="user">User</param>
        /// <param name="link">Email activation link</param>
        /// <param name="plainPassword">
        /// Can be set to user's plain password to include it in the email.
        /// </param>
        [UnitOfWork]
        public virtual async Task SendEmailActivationLinkAsync(User user, string link, string plainPassword = null)
        {
            if (!user.TenantId.HasValue)
            {
                await SendEmailActivationLinkDefaultTemplateAsync(user, link, plainPassword);
                return;
            }

            switch (user.TenantId)
            {
                case FinfindTenantId:
                    {
						await SendEmailActivationLinkTemplateAsync(user, link, "finfind-master", "finfind-email-activation-link", "support@finfind.co.za", "EmailActivation_Subject", plainPassword);
                        break;
                    }
                case SefaTenantId:
                    {
						await SendEmailActivationLinkTemplateAsync(user, link, "sefa-master", "sefa-email-activation-link", "sefa@finfind.co.za", "EmailActivationSefa_Subject", plainPassword);
                        break;
                    }
                case EcdcTenantId:
                    {
						await SendEmailActivationLinkTemplateAsync(user, link, "ecdc-master", "ecdc-email-activation-link", "ecdcsupport@finfind.co.za", "EmailActivationEcdc_Subject", plainPassword);
                        break;
                    }

				case CompanyPartnersTenantId:
					{
						await SendEmailActivationLinkTemplateAsync(user, link, "company-partners-master", "company-partners-email-activation-link", "support@finfind.co.za", "EmailActivationCompanyPartners_Subject", plainPassword);
						break;
					}

				case AfricanBankTenantId:
					{
						await SendEmailActivationLinkTemplateAsync(user, link, "african-bank-master", "african-bank-email-activation-link", "support@finfind.co.za", "EmailActivationAfricanBank_Subject", plainPassword);
						break;
					}

				case HlooloTenantId:
					{
						await SendEmailActivationLinkTemplateAsync(user, link, "hloolo-master", "hloolo-email-activation-link", "hloolosupport@finfind.co.za", "EmailActivationHloolo_Subject", plainPassword);
						break;
					}
			}
        }

        /// <summary>
        /// Send email activation link for Business Support to user's email address.
        /// </summary>
        /// <param name="user"></param>
        /// <param name="link"></param>
        /// <param name="source"></param>
        /// <param name="plainPassword"></param>
        /// <returns></returns>
        [UnitOfWork]
        public virtual async Task SendEmailActivationLinkForBusinessSupportAsync(User user, string link, string source, string plainPassword = null)
        {
            if (!user.TenantId.HasValue)
            {
                await SendEmailActivationLinkDefaultTemplateAsync(user, link, plainPassword);
                return;
            }

            await SendEmailActivationLinkEcdcTemplateAsyncForBusinessSupport(user, link, plainPassword, source);

        }

        private async Task SendEmailActivationLinkDefaultTemplateAsync(User user, string link, string plainPassword = null)
        {
            if (user.EmailConfirmationCode.IsNullOrEmpty())
            {
                throw new Exception("EmailConfirmationCode should be set in order to send email activation link.");
            }

            link = link.Replace("{userId}", user.Id.ToString());
            link = link.Replace("{confirmationCode}", Uri.EscapeDataString(user.EmailConfirmationCode));

            if (user.TenantId.HasValue)
            {
                link = link.Replace("{tenantId}", user.TenantId.ToString());
            }

            link = EncryptQueryParameters(link);

            var tenancyName = GetTenancyNameOrNull(user.TenantId);
            var emailTemplate = GetTitleAndSubTitle(user.TenantId, L("EmailActivation_Title"), L("EmailActivation_SubTitle"));
            var mailMessage = new StringBuilder();

            mailMessage.AppendLine("<b>" + L("Name") + "</b>: " + user.Name + " " + user.Surname + "<br />");

            //if (!tenancyName.IsNullOrEmpty())
            //{
            //    mailMessage.AppendLine("<b>" + L("TenancyName") + "</b>: " + tenancyName + "<br />");
            //}

            mailMessage.AppendLine("<b>" + L("EmailAddress") + "</b>: " + user.EmailAddress + "<br />");

            if (!plainPassword.IsNullOrEmpty())
            {
                mailMessage.AppendLine("<b>" + L("Password") + "</b>: " + plainPassword + "<br />");
            }

            mailMessage.AppendLine("<br />");
            mailMessage.AppendLine(L("EmailActivation_ClickTheLinkBelowToVerifyYourEmail") + "<br /><br />");

            mailMessage.AppendLine("<a style=\"" + _emailButtonStyle + "\" bg-color=\"" + _emailButtonColor + "\" href=\"" + link + "\">" + L("VerifyEmail") + "</a>");
            mailMessage.AppendLine("<br />");
            mailMessage.AppendLine("<br />");
            mailMessage.AppendLine("<br />");
            mailMessage.AppendLine("<span style=\"font-size: 9pt;\">" + L("EmailMessage_CopyTheLinkBelowToYourBrowser") + "</span><br />");
            mailMessage.AppendLine("<span style=\"font-size: 8pt;\">" + link + "</span>");

            await ReplaceBodyAndSend(user.EmailAddress, L("EmailActivation_Subject"), emailTemplate, mailMessage);
        }

        private async Task SendEmailActivationLinkEcdcTemplateAsyncForBusinessSupport(User user, string link, string plainPassword = null, string source = "")
        {
            if (user.EmailConfirmationCode.IsNullOrEmpty())
            {
                throw new Exception("EmailConfirmationCode should be set in order to send email activation link.");
            }

            link = link.Replace("{userId}", user.Id.ToString());
            link = link.Replace("{confirmationCode}", Uri.EscapeDataString(user.EmailConfirmationCode));
            link = link.Replace("{tenantId}", user.TenantId.ToString());

            link = link.Replace("{source}", source);

            link = EncryptQueryParameters(link);

            var tenancyName = GetTenancyNameOrNull(user.TenantId);
            var emailTemplate = new StringBuilder(_emailTemplateProvider.GetTemplate("ecdc-master"));
            var emailBodyTemplate = new StringBuilder(_emailTemplateProvider.GetTemplate("ecdc-email-activation-link"));

            emailBodyTemplate.Replace("{NAME}", user.Name);
            emailBodyTemplate.Replace("{LINK}", link);


            await ReplaceBodyAndSend("ecdcsupport@finfind.co.za", user.EmailAddress, L("EmailActivationEcdc_Subject"), emailTemplate, emailBodyTemplate);
        }

		private async Task SendEmailActivationLinkTemplateAsync(
			User user, 
			string link,
			string masterHtmlName,
			string emailActiviationLinkHtmlName,
			string suportEmailAddress,
			string emailActiviationSubjectStringTableName,
			string plainPassword = null
		)
		{
			if(user.EmailConfirmationCode.IsNullOrEmpty())
			{
				throw new Exception("EmailConfirmationCode should be set in order to send email activation link.");
			}

			link = link.Replace("{userId}", user.Id.ToString());
			link = link.Replace("{confirmationCode}", Uri.EscapeDataString(user.EmailConfirmationCode));
			link = link.Replace("{tenantId}", user.TenantId.ToString());

			link = EncryptQueryParameters(link);

			var tenancyName = GetTenancyNameOrNull(user.TenantId);
			var emailTemplate = new StringBuilder(_emailTemplateProvider.GetTemplate(masterHtmlName));
			var emailBodyTemplate = new StringBuilder(_emailTemplateProvider.GetTemplate(emailActiviationLinkHtmlName));

			emailBodyTemplate.Replace("{NAME}", user.Name);
			emailBodyTemplate.Replace("{LINK}", link);

			// TODO: Make sure this is changed to the appropriate email address for african bank
			await ReplaceBodyAndSend(suportEmailAddress, user.EmailAddress, L(emailActiviationSubjectStringTableName), emailTemplate, emailBodyTemplate);
		}

		/// <summary>
		/// Sends a password reset link to user's email.
		/// </summary>
		/// <param name="user">User</param>
		/// <param name="link">Reset link</param>
		public async Task SendPasswordResetLinkAsync(User user, string link = null)
        {
            if (!user.TenantId.HasValue)
            {
                await SendPasswordResetLinkDefaultTemplateAsync(user, link);
                return;
            }

            switch (user.TenantId)
            {
                case FinfindTenantId:
                    {
						await SendPasswordResetLinkTemplateAsync(user, "finfind-master", "finfind-password-reset-link", user.EmailAddress, "PasswordResetEmail_Subject", link);
                        break;
                    }
                case SefaTenantId:
                    {
						await SendPasswordResetLinkTemplateAsync(user, "sefa-master", "sefa-password-reset-link", "sefa@finfind.co.za", "PasswordResetEmailSefa_Subject", link);
						break;
                    }
                case EcdcTenantId:
                    {
						await SendPasswordResetLinkTemplateAsync(user, "ecdc-master", "ecdc-password-reset-link", "ecdcsupport@finfind.co.za", "PasswordResetEmailEcdc_Subject", link);
						break;
                    }

				case CompanyPartnersTenantId:
					{
						await SendPasswordResetLinkTemplateAsync(user, "company-partners-master", "company-partners-password-reset-link", "support@finfind.co.za", "PasswordResetEmailCompanyPartners_Subject", link);
						break;
					}

				case AfricanBankTenantId:
					{
						await SendPasswordResetLinkTemplateAsync(user, "african-bank-master", "african-bank-password-reset-link", "support@finfind.co.za", "PasswordResetEmailAfricanBank_Subject", link);
						break;
					}

				case HlooloTenantId:
					{
						await SendPasswordResetLinkTemplateAsync(user, "hloolo-master", "hloolo-password-reset-link", "hloolosupport@finfind.co.za", "PasswordResetEmailHloolo_Subject", link);
						break;
					}
			}
        }
        /// <summary>
		/// Sends FundForm link to user's email.
		/// </summary>
		/// <param name="fundforms">FundForms</param>
		/// <param name="link">FundForm link</param>
        public async Task SendFundFormsLinkAsync(FundForms fundforms, string link = null)
        {
            await SendFundFormLinkTemplateAsync(fundforms, "finfind-fund-form-link", link);
        }

        public async Task SendPasswordResetLinkDefaultTemplateAsync(User user, string link = null)
        {
            if (user.PasswordResetCode.IsNullOrEmpty())
            {
                throw new Exception("PasswordResetCode should be set in order to send password reset link.");
            }

            var tenancyName = GetTenancyNameOrNull(user.TenantId);
            var emailTemplate = GetTitleAndSubTitle(user.TenantId, L("PasswordResetEmail_Title"), L("PasswordResetEmail_SubTitle"));
            var mailMessage = new StringBuilder();

            mailMessage.AppendLine("<b>" + L("Name") + "</b>: " + user.Name + " " + user.Surname + "<br />");

            //if (!tenancyName.IsNullOrEmpty())
            //{
            //    mailMessage.AppendLine("<b>" + L("TenancyName") + "</b>: " + tenancyName + "<br />");
            //}

            mailMessage.AppendLine("<b>" + L("Email") + "</b>: " + user.EmailAddress + "<br />");
            mailMessage.AppendLine("<b>" + L("ResetCode") + "</b>: " + user.PasswordResetCode + "<br />");

            if (!link.IsNullOrEmpty())
            {
                link = link.Replace("{userId}", user.Id.ToString());
                link = link.Replace("{resetCode}", Uri.EscapeDataString(user.PasswordResetCode));

                if (user.TenantId.HasValue)
                {
                    link = link.Replace("{tenantId}", user.TenantId.ToString());
                }

                link = EncryptQueryParameters(link);

                mailMessage.AppendLine("<br />");
                mailMessage.AppendLine(L("PasswordResetEmail_ClickTheLinkBelowToResetYourPassword") + "<br /><br />");

                mailMessage.AppendLine("<a style=\"" + _emailButtonStyle + "\" bg-color=\"" + _emailButtonColor + "\" href=\"" + link + "\">" + L("Reset") + "</a>");
                mailMessage.AppendLine("<br />");
                mailMessage.AppendLine("<br />");
                mailMessage.AppendLine("<br />");
                mailMessage.AppendLine("<span style=\"font-size: 9pt;\">" + L("EmailMessage_CopyTheLinkBelowToYourBrowser") + "</span><br />");
                mailMessage.AppendLine("<span style=\"font-size: 8pt;\">" + link + "</span>");
            }

            await ReplaceBodyAndSend(user.EmailAddress, L("PasswordResetEmail_Subject"), emailTemplate, mailMessage);
        }

		public async Task SendPasswordResetLinkTemplateAsync(
			User user,
			string masterHtmlName,
			string passwordResetLinkHtmlName,
			string suportEmailAddress,
			string emailPasswordResetSubjectStringTableName,
			string link = null
		)
		{
			if(user.PasswordResetCode.IsNullOrEmpty())
			{
				throw new Exception("PasswordResetCode should be set in order to send password reset link.");
			}

			link = link.Replace("{userId}", user.Id.ToString());
			link = link.Replace("{resetCode}", Uri.EscapeDataString(user.PasswordResetCode));
			link = link.Replace("{tenantId}", user.TenantId.ToString());

			link = EncryptQueryParameters(link);

			var tenancyName = GetTenancyNameOrNull(user.TenantId);
			var emailTemplate = new StringBuilder(_emailTemplateProvider.GetTemplate(masterHtmlName));
			var emailBodyTemplate = new StringBuilder(_emailTemplateProvider.GetTemplate(passwordResetLinkHtmlName));

			emailBodyTemplate.Replace("{NAME}", user.Name);
			emailBodyTemplate.Replace("{LINK}", link);

			// TODO: Make sure this is changed to the appropriate email address.
			await ReplaceBodyAndSend(suportEmailAddress, user.EmailAddress, L(emailPasswordResetSubjectStringTableName), emailTemplate, emailBodyTemplate);
		}

        public async Task SendFundFormLinkTemplateAsync(
        FundForms fundforms,
        string fundFormLinkHtmlName,
        string link = null
        )
        {
            if (fundforms.Token == null && fundforms.Token == Guid.Empty)
            {
                throw new Exception("Token should be present in order to send fundforms link.");
            }
            link = link.Replace("{tokens}", fundforms.Token.ToString());
            link = EncryptQueryParameters(link);
            var emailTemplate = new StringBuilder(_emailTemplateProvider.GetTemplateByTenantId(fundforms.TenantId));
            var emailBodyTemplate = new StringBuilder(_emailTemplateProvider.GetTemplate(fundFormLinkHtmlName));
            emailBodyTemplate.Replace("{lenderName}", fundforms.LenderName);
            emailBodyTemplate.Replace("{financeProductName}", fundforms.FinanceProductName);
            emailBodyTemplate.Replace("{fundFormLink}", link);
            var fundFormSubject = L("FundForm_Subject").Replace("{lenderName}", fundforms.LenderName);
            fundFormSubject = fundFormSubject.Replace("{financeProductName}", fundforms.FinanceProductName);
            await ReplaceBodyAndSend(fundforms.EmailAddress, fundFormSubject, emailTemplate, emailBodyTemplate);
        }

		public async Task TryToSendChatMessageMail(User user, string senderUsername, string senderTenancyName, ChatMessage chatMessage)
        {
            try
            {
                var emailTemplate = GetTitleAndSubTitle(user.TenantId, L("NewChatMessageEmail_Title"), L("NewChatMessageEmail_SubTitle"));
                var mailMessage = new StringBuilder();

                mailMessage.AppendLine("<b>" + L("Sender") + "</b>: " + senderTenancyName + "/" + senderUsername + "<br />");
                mailMessage.AppendLine("<b>" + L("Time") + "</b>: " + chatMessage.CreationTime.ToUniversalTime().ToString("yyyy-MM-dd HH:mm:ss") + " UTC<br />");
                mailMessage.AppendLine("<b>" + L("Message") + "</b>: " + chatMessage.Message + "<br />");
                mailMessage.AppendLine("<br />");

                await ReplaceBodyAndSend(user.EmailAddress, L("NewChatMessageEmail_Subject"), emailTemplate, mailMessage);
            }
            catch (Exception exception)
            {
                Logger.Error(exception.Message, exception);
            }
        }

        public async Task SendApplicationExpiresSoonMail(User user, string enquiry)
        {
            try
            {
                if (user == null)
                {
                    throw new Exception("User cannot be empty.");
                }

                var tenancyName = GetTenancyNameOrNull(user.TenantId);
                var emailTemplate = new StringBuilder(_emailTemplateProvider.GetTemplate("sefa-master"));
                var emailBodyTemplate = new StringBuilder(_emailTemplateProvider.GetTemplate("sefa-application-expire-reminder"));
                var emailSubject = L("ApplicationExpiresSoonSefa_Subject").Replace("(EnqNumber)", enquiry);

                emailBodyTemplate.Replace("{NAME}", user.Name + " " + user.Surname);
                
                await ReplaceBodyAndSend("sefa@finfind.co.za", user.EmailAddress, emailSubject, emailTemplate, emailBodyTemplate);
            }
            catch (Exception exception)
            {
                Logger.Error(exception.Message, exception);
            }
        }

        public async Task SendApplicationHasExpiredMail(User user, string enquiry)
        {
            try
            {
                if (user == null)
                {
                    throw new Exception("User cannot be empty.");
                }

                var tenancyName = GetTenancyNameOrNull(user.TenantId);
                var emailTemplate = new StringBuilder(_emailTemplateProvider.GetTemplate("sefa-master"));
                var emailBodyTemplate = new StringBuilder(_emailTemplateProvider.GetTemplate("sefa-application-expired"));
                var emailSubject = L("ApplicationExpiredSefa_Subject").Replace("(EnqNumber)", enquiry);

                emailBodyTemplate.Replace("{NAME}", user.Name + " " + user.Surname);
                emailBodyTemplate.Replace("{ENQUIRY}", enquiry);

                await ReplaceBodyAndSend("sefa@finfind.co.za", user.EmailAddress, emailSubject, emailTemplate, emailBodyTemplate);
            }
            catch (Exception exception)
            {
                Logger.Error(exception.Message, exception);
            }
        }

        public async Task SendApplicationHasExpiredToSefaMail(string recipient1, string recipient2, string recipientName, string enquiry)
        {
            try
            {
                if (recipient1 == null)
                {
                    throw new Exception("User cannot be empty.");
                }

                var tenancyName = GetTenancyNameOrNull(3);
                var emailTemplate = new StringBuilder(_emailTemplateProvider.GetTemplate("sefa-master"));
                var emailBodyTemplate = new StringBuilder(_emailTemplateProvider.GetTemplate("sefa-application-expired-sefa-notification"));
                var emailSubject = L("ApplicationExpiredSefaNotification_Subject").Replace("(EnqNumber)", enquiry);

                emailBodyTemplate.Replace("{ENQUIRY}", enquiry);
                emailBodyTemplate.Replace("{NAME}", recipientName);

                await ReplaceBodyAndSend("sefa@finfind.co.za", recipient1, emailSubject, emailTemplate, emailBodyTemplate);
                if (recipient2 != null)
                    await ReplaceBodyAndSend("sefa@finfind.co.za", recipient2, emailSubject, emailTemplate, emailBodyTemplate);
            }
            catch (Exception exception)
            {
                Logger.Error(exception.Message, exception);
            }
        }

		public async Task SendApplicationFailedNotification(
			string nameTo,
			string details,
			string masterTemplateName,
			string failedTemplateName
		)
		{
			try
			{
				var user = _userManager.Users.FirstOrDefault(x => x.Id == _abpSession.UserId);

				var emailTemplate = new StringBuilder(_emailTemplateProvider.GetTemplate(masterTemplateName));
				var emailBodyTemplate = new StringBuilder(_emailTemplateProvider.GetTemplate(failedTemplateName));
				var emailSubject = L("ApplicationFailedNotification");

				emailBodyTemplate.Replace("{DETAILS}", details);
				emailBodyTemplate.Replace("{EMAILADDRESS}", user.EmailAddress);
				emailBodyTemplate.Replace("{NAME}", nameTo);

				await ReplaceBodyAndSend("support@finfind.co.za", "nico@finfind.co.za", emailSubject, emailTemplate, emailBodyTemplate);
				await ReplaceBodyAndSend("support@finfind.co.za", "peter@finfind.co.za", emailSubject, emailTemplate, emailBodyTemplate);
			}
			catch(Exception exception)
			{
				Logger.Error(exception.Message, exception);
			}
		}

		public async Task SendApplicationFailedNotificationMail(string recipient, string recipientName, string enquiry, string emailAddress)
        {
            try
            {
                if (recipient == null)
                {
                    throw new Exception("User cannot be empty.");
                }

                var tenancyName = GetTenancyNameOrNull(3);
                var emailTemplate = new StringBuilder(_emailTemplateProvider.GetTemplate("sefa-master"));
                var emailBodyTemplate = new StringBuilder(_emailTemplateProvider.GetTemplate("sefa-application-failed-notification"));
                var emailSubject = L("ApplicationFailedNotification_Subject").Replace("(EnqNumber)", enquiry);

                emailBodyTemplate.Replace("{ENQUIRY}", enquiry);
                emailBodyTemplate.Replace("{EMAILADDRESS}", emailAddress);
                emailBodyTemplate.Replace("{NAME}", recipientName);

                await ReplaceBodyAndSend("sefa@finfind.co.za", recipient, emailSubject, emailTemplate, emailBodyTemplate);
            }
            catch (Exception exception)
            {
                Logger.Error(exception.Message, exception);
            }
        }

        public async Task SendEcdcApplicationSubmittedNotification(string supportEmail, string infoEmail, SubmitToECDCDto payload)
        {
            try
            {
                var emailTemplate = new StringBuilder(_emailTemplateProvider.GetTemplate("ecdc-master"));
                var emailBodyTemplate = new StringBuilder(_emailTemplateProvider.GetTemplate("ecdc-email-application-submitted"));
                var emailSubject = L("ECDCApplicationSubmitted_Subject").Replace("(ApplicationNumber)", payload.ApplicationId.ToString());

                emailBodyTemplate.Replace("{COMPANYNAME}", payload.CompanyName);
                emailBodyTemplate.Replace("{PRODUCT}", payload.ProductMatched);
                emailBodyTemplate.Replace("{REGIONALOFFICE}", payload.RegionalOffice);


                await ReplaceBodyAndSend("ecdcsupport@finfind.co.za", supportEmail, emailSubject, emailTemplate, emailBodyTemplate);
                await ReplaceBodyAndSend("ecdcsupport@finfind.co.za", infoEmail, emailSubject, emailTemplate, emailBodyTemplate);
            }
            catch (Exception exception)
            {
                Logger.Error(exception.Message, exception);
            }
        }

        public async Task TryToSendSubscriptionExpireEmail(int tenantId, DateTime utcNow)
        {
            try
            {
                using (_unitOfWorkManager.Begin())
                {
                    using (_unitOfWorkManager.Current.SetTenantId(tenantId))
                    {
                        var tenantAdmin = await _userManager.GetAdminAsync();
                        if (tenantAdmin == null || string.IsNullOrEmpty(tenantAdmin.EmailAddress))
                        {
                            return;
                        }

                        var hostAdminLanguage = _settingManager.GetSettingValueForUser(LocalizationSettingNames.DefaultLanguage, tenantAdmin.TenantId, tenantAdmin.Id);
                        var culture = CultureHelper.GetCultureInfoByChecking(hostAdminLanguage);
                        var emailTemplate = GetTitleAndSubTitle(tenantId, L("SubscriptionExpire_Title"), L("SubscriptionExpire_SubTitle"));
                        var mailMessage = new StringBuilder();

                        mailMessage.AppendLine("<b>" + L("Message") + "</b>: " + L("SubscriptionExpire_Email_Body", culture, utcNow.ToString("yyyy-MM-dd") + " UTC") + "<br />");
                        mailMessage.AppendLine("<br />");

                        await ReplaceBodyAndSend(tenantAdmin.EmailAddress, L("SubscriptionExpire_Email_Subject"), emailTemplate, mailMessage);
                    }
                }
            }
            catch (Exception exception)
            {
                Logger.Error(exception.Message, exception);
            }
        }

        public async Task TryToSendSubscriptionAssignedToAnotherEmail(int tenantId, DateTime utcNow, int expiringEditionId)
        {
            try
            {
                using (_unitOfWorkManager.Begin())
                {
                    using (_unitOfWorkManager.Current.SetTenantId(tenantId))
                    {
                        var tenantAdmin = await _userManager.GetAdminAsync();
                        if (tenantAdmin == null || string.IsNullOrEmpty(tenantAdmin.EmailAddress))
                        {
                            return;
                        }

                        var hostAdminLanguage = _settingManager.GetSettingValueForUser(LocalizationSettingNames.DefaultLanguage, tenantAdmin.TenantId, tenantAdmin.Id);
                        var culture = CultureHelper.GetCultureInfoByChecking(hostAdminLanguage);
                        var expringEdition = await _editionManager.GetByIdAsync(expiringEditionId);
                        var emailTemplate = GetTitleAndSubTitle(tenantId, L("SubscriptionExpire_Title"), L("SubscriptionExpire_SubTitle"));
                        var mailMessage = new StringBuilder();

                        mailMessage.AppendLine("<b>" + L("Message") + "</b>: " + L("SubscriptionAssignedToAnother_Email_Body", culture, expringEdition.DisplayName, utcNow.ToString("yyyy-MM-dd") + " UTC") + "<br />");
                        mailMessage.AppendLine("<br />");

                        await ReplaceBodyAndSend(tenantAdmin.EmailAddress, L("SubscriptionExpire_Email_Subject"), emailTemplate, mailMessage);
                    }
                }
            }
            catch (Exception exception)
            {
                Logger.Error(exception.Message, exception);
            }
        }

        public async Task TryToSendFailedSubscriptionTerminationsEmail(List<string> failedTenancyNames, DateTime utcNow)
        {
            try
            {
                var hostAdmin = await _userManager.GetAdminAsync();
                if (hostAdmin == null || string.IsNullOrEmpty(hostAdmin.EmailAddress))
                {
                    return;
                }

                var hostAdminLanguage = _settingManager.GetSettingValueForUser(LocalizationSettingNames.DefaultLanguage, hostAdmin.TenantId, hostAdmin.Id);
                var culture = CultureHelper.GetCultureInfoByChecking(hostAdminLanguage);
                var emailTemplate = GetTitleAndSubTitle(null, L("FailedSubscriptionTerminations_Title"), L("FailedSubscriptionTerminations_SubTitle"));
                var mailMessage = new StringBuilder();

                mailMessage.AppendLine("<b>" + L("Message") + "</b>: " + L("FailedSubscriptionTerminations_Email_Body", culture, string.Join(",", failedTenancyNames), utcNow.ToString("yyyy-MM-dd") + " UTC") + "<br />");
                mailMessage.AppendLine("<br />");

                await ReplaceBodyAndSend(hostAdmin.EmailAddress, L("FailedSubscriptionTerminations_Email_Subject"), emailTemplate, mailMessage);
            }
            catch (Exception exception)
            {
                Logger.Error(exception.Message, exception);
            }
        }

        public async Task TryToSendSubscriptionExpiringSoonEmail(int tenantId, DateTime dateToCheckRemainingDayCount)
        {
            try
            {
                using (_unitOfWorkManager.Begin())
                {
                    using (_unitOfWorkManager.Current.SetTenantId(tenantId))
                    {
                        var tenantAdmin = await _userManager.GetAdminAsync();
                        if (tenantAdmin == null || string.IsNullOrEmpty(tenantAdmin.EmailAddress))
                        {
                            return;
                        }

                        var tenantAdminLanguage = _settingManager.GetSettingValueForUser(LocalizationSettingNames.DefaultLanguage, tenantAdmin.TenantId, tenantAdmin.Id);
                        var culture = CultureHelper.GetCultureInfoByChecking(tenantAdminLanguage);

                        var emailTemplate = GetTitleAndSubTitle(null, L("SubscriptionExpiringSoon_Title"), L("SubscriptionExpiringSoon_SubTitle"));
                        var mailMessage = new StringBuilder();

                        mailMessage.AppendLine("<b>" + L("Message") + "</b>: " + L("SubscriptionExpiringSoon_Email_Body", culture, dateToCheckRemainingDayCount.ToString("yyyy-MM-dd") + " UTC") + "<br />");
                        mailMessage.AppendLine("<br />");

                        await ReplaceBodyAndSend(tenantAdmin.EmailAddress, L("SubscriptionExpiringSoon_Email_Subject"), emailTemplate, mailMessage);
                    }
                }
            }
            catch (Exception exception)
            {
                Logger.Error(exception.Message, exception);
            }
        }

        private string GetTenancyNameOrNull(int? tenantId)
        {
            if (tenantId == null)
            {
                return null;
            }

            using (_unitOfWorkProvider.Current.SetTenantId(null))
            {
                return _tenantRepository.Get(tenantId.Value).TenancyName;
            }
        }

        private StringBuilder GetTitleAndSubTitle(int? tenantId, string title, string subTitle)
        {
            var emailTemplate = new StringBuilder(_emailTemplateProvider.GetDefaultTemplate(tenantId));
            emailTemplate.Replace("{EMAIL_TITLE}", title);
            emailTemplate.Replace("{EMAIL_SUB_TITLE}", subTitle);

            return emailTemplate;
        }

        private async Task ReplaceBodyAndSend(string fromEmailAddress, string emailAddress, string subject, StringBuilder emailTemplate, StringBuilder mailMessage)
        {
            emailTemplate.Replace("{EMAIL_BODY}", mailMessage.ToString());

            var email = new MailMessage
            {
                To = { emailAddress },
                Subject = subject,
                Body = emailTemplate.ToString(),
                IsBodyHtml = true
            };

            if (!string.IsNullOrEmpty(fromEmailAddress))
                email.From = new MailAddress(fromEmailAddress);

            await _emailSender.SendAsync(email);
        }

        private async Task ReplaceBodyAndSend(string emailAddress, string subject, StringBuilder emailTemplate, StringBuilder mailMessage)
        {
           await ReplaceBodyAndSend(null, emailAddress, subject, emailTemplate, mailMessage);
        }

        /// <summary>
        /// Returns link with encrypted parameters
        /// </summary>
        /// <param name="link"></param>
        /// <param name="encrptedParameterName"></param>
        /// <returns></returns>
        private string EncryptQueryParameters(string link, string encrptedParameterName = "c")
        {
            if (!link.Contains("?"))
            {
                return link;
            }

            var basePath = link.Substring(0, link.IndexOf('?'));
            var query = link.Substring(link.IndexOf('?')).TrimStart('?');

            return basePath + "?" + encrptedParameterName + "=" + HttpUtility.UrlEncode(SimpleStringCipher.Instance.Encrypt(query));
        }
    }
}
