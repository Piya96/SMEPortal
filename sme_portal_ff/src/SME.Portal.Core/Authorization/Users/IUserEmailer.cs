using System.Threading.Tasks;
using SME.Portal.Chat;
using SME.Portal.Lenders;
using SME.Portal.SME.Dtos;

namespace SME.Portal.Authorization.Users
{
    public interface IUserEmailer
    {
        /// <summary>
        /// Send email activation link to user's email address.
        /// </summary>
        /// <param name="user">User</param>
        /// <param name="link">Email activation link</param>
        /// <param name="plainPassword">
        /// Can be set to user's plain password to include it in the email.
        /// </param>
        Task SendEmailActivationLinkAsync(User user, string link, string plainPassword = null);

        /// <summary>
        /// Send email activation link to user's email address.
        /// </summary>
        /// <param name="user">User</param>
        /// <param name="link">Email activation link</param>
        /// <param name="source">
        /// <param name="plainPassword">
        /// Can be set to user's plain password to include it in the email.
        /// </param>
        Task SendEmailActivationLinkForBusinessSupportAsync(User user, string link, string source, string plainPassword = null);

        /// <summary>
        /// Sends a password reset link to user's email.
        /// </summary>
        /// <param name="user">User</param>
        /// <param name="link">Password reset link (optional)</param>
        Task SendPasswordResetLinkAsync(User user, string link = null);
        
        /// <summary>
        /// Sends fundform link to user's email.
        /// </summary>
        /// <param name="fundforms">FundForms</param>
        /// <param name="link">fundform link (optional)</param>
        Task SendFundFormsLinkAsync(FundForms fundforms, string link = null);

        /// <summary>
        /// Sends an email for unread chat message to user's email.
        /// </summary>
        /// <param name="user"></param>
        /// <param name="senderUsername"></param>
        /// <param name="senderTenancyName"></param>
        /// <param name="chatMessage"></param>
        Task TryToSendChatMessageMail(User user, string senderUsername, string senderTenancyName, ChatMessage chatMessage);

        /// <summary>
        /// Sends an email to remind client of application expiry
        /// </summary>
        /// <param name="user"></param>
        /// <param name="enquiry"></param>
        Task SendApplicationExpiresSoonMail(User user, string enquiry);

        /// <summary>
        /// Sends an email to notify client of application expiry
        /// </summary>
        /// <param name="user"></param>
        /// <param name="enquiry"></param>
        Task SendApplicationHasExpiredMail(User user, string enquiry);

        /// <summary>
        /// Sends an email to notify Sefa of application expiry
        /// </summary>
        /// <param name="recipient"></param>
        /// <param name="recipientName"></param>
        /// <param name="enquiry"></param>
        Task SendApplicationHasExpiredToSefaMail(string recipient, string recipient2, string recipientName, string enquiry);
		/// <summary>
		/// Sends an email to notify nico@finfind.co.za and peter@finfind.co.za on application submission failure for ECDC and potentially other tenants if needed.
		/// </summary>
		/// <param name="nameTo"></param>
		/// <param name="details"></param>
		/// <param name="masterTemplateName"></param>
		/// <param name="failedTemplateName"></param>
		Task SendApplicationFailedNotification(string nameTo, string details, string masterTemplateName, string failedTemplateName);
		/// <summary>
		/// Sends an email to notify FinFind of failed application submission
		/// </summary>
		/// <param name="user"></param>
		Task SendApplicationFailedNotificationMail(string recipient1, string recipientName, string enquiry, string emailAddress);

        /// <summary>
        /// Sends an email to notify ECDC of new application submission
        /// </summary>
        /// <param name="user"></param>
        Task SendEcdcApplicationSubmittedNotification(string supportEmail, string infoEmail, SubmitToECDCDto payload);




    }
}
