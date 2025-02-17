using System.ComponentModel.DataAnnotations;

namespace SME.Portal.Web.Models.Account
{
    public class SendPasswordResetLinkViewModel
    {
        [Required]
        public string EmailAddress { get; set; }
    }
}