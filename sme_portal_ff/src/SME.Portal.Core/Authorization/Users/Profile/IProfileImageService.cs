using Abp;
using Abp.Domain.Services;
using System.Threading.Tasks;

namespace SME.Portal.Authorization.Users.Profile
{
    public interface IProfileImageService : IDomainService
    {
        Task<string> GetProfilePictureContentForUser(UserIdentifier userIdentifier);
    }
}