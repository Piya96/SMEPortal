using System.Threading.Tasks;
using SME.Portal.Views;
using Xamarin.Forms;

namespace SME.Portal.Services.Modal
{
    public interface IModalService
    {
        Task ShowModalAsync(Page page);

        Task ShowModalAsync<TView>(object navigationParameter) where TView : IXamarinView;

        Task<Page> CloseModalAsync();
    }
}
