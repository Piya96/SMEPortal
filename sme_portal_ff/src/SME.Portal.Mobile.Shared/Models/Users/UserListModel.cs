using System.ComponentModel;
using Abp.AutoMapper;
using SME.Portal.Authorization.Users.Dto;
using Xamarin.Forms;

namespace SME.Portal.Models.Users
{
    [AutoMapFrom(typeof(UserListDto))]
    public class UserListModel : UserListDto, INotifyPropertyChanged
    {
        private ImageSource _photo;

        public string FullName => Name + " " + Surname;

        public ImageSource Photo
        {
            get => _photo;
            set
            {
                _photo = value;
                RaisePropertyChanged(nameof(Photo));
            }
        }

        public event PropertyChangedEventHandler PropertyChanged;

        protected void RaisePropertyChanged(string name)
        {
            PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(name));
        }
    }
}