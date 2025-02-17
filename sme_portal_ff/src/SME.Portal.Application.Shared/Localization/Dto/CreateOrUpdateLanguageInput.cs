using System.ComponentModel.DataAnnotations;

namespace SME.Portal.Localization.Dto
{
    public class CreateOrUpdateLanguageInput
    {
        [Required]
        public ApplicationLanguageEditDto Language { get; set; }
    }
}