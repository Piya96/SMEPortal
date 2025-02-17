using System.ComponentModel.DataAnnotations;

namespace SME.Portal.Authorization.Users.Dto
{
    public class ChangeUserLanguageDto
    {
        [Required]
        public string LanguageName { get; set; }
    }
}
