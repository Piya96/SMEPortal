using System.ComponentModel.DataAnnotations;

namespace SME.Portal.Authorization.Accounts.Dto
{
    public class SendEmailActivationLinkInput
    {
        [Required]
        public string EmailAddress { get; set; }
    }
}