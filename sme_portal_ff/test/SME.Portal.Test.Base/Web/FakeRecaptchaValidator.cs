using System.Threading.Tasks;
using SME.Portal.Security.Recaptcha;

namespace SME.Portal.Test.Base.Web
{
    public class FakeRecaptchaValidator : IRecaptchaValidator
    {
        public Task ValidateAsync(string captchaResponse)
        {
            return Task.CompletedTask;
        }
    }
}
