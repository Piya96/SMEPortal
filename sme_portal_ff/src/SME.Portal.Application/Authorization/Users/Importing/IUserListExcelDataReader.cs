using System.Collections.Generic;
using SME.Portal.Authorization.Users.Importing.Dto;
using Abp.Dependency;

namespace SME.Portal.Authorization.Users.Importing
{
    public interface IUserListExcelDataReader: ITransientDependency
    {
        List<ImportUserDto> GetUsersFromExcel(byte[] fileBytes);
    }
}
