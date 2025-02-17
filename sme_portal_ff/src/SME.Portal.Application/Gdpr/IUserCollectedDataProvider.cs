using System.Collections.Generic;
using System.Threading.Tasks;
using Abp;
using SME.Portal.Dto;

namespace SME.Portal.Gdpr
{
    public interface IUserCollectedDataProvider
    {
        Task<List<FileDto>> GetFiles(UserIdentifier user);
    }
}
