using System.Collections.Generic;
using SME.Portal.Authorization.Users.Dto;
using SME.Portal.Dto;

namespace SME.Portal.Authorization.Users.Exporting
{
    public interface IUserListExcelExporter
    {
        FileDto ExportToFile(List<UserListDto> userListDtos);
    }
}