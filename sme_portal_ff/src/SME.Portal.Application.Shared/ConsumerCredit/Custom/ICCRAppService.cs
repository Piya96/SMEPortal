using System.Threading.Tasks;
using Abp.Application.Services;
using SME.Portal.CCR.Dtos;

namespace SME.Portal.CCR.Interface
{
	// CCR - (C)onsumer (C)redit (R)eport )
	public interface ICCRAppService :
		IApplicationService
	{
		CCRStatusDto GetStatus();

		Task<CCROutputDto> GetReport(CCRInputDto input);
	}
}
