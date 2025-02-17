using System.Collections.Generic;
using SME.Portal.Authorization.Users.Importing.Dto;
using SME.Portal.Dto;

namespace SME.Portal.Authorization.Users.Importing
{
    public interface IInvalidUserExporter
    {
        FileDto ExportToFile(List<ImportUserDto> userListDtos);
    }
}
