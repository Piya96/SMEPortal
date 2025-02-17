using System.Threading.Tasks;
using Abp.Application.Services;
using SME.Portal.CCS.Dtos;

namespace SME.Portal.CCS.Interface
{
	// CCS - (C)onsumer (C)redit (S)core )
	public interface ICCSAppService :
		IApplicationService
	{
		CCSStatusDto GetStatus();

		Task<CCSOutputDto> GetScore(CCSInputDto input);
	}
}
