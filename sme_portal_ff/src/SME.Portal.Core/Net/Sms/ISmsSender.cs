using System.Threading.Tasks;

namespace SME.Portal.Net.Sms
{
    public interface ISmsSender
    {
        Task SendAsync(string number, string message);
    }
}