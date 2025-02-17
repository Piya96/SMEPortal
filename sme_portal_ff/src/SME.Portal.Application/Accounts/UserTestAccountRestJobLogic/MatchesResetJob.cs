using Abp.Threading;
using SME.Portal.Lenders;
using SME.Portal.Lenders.Dtos;
using System.Collections.Generic;
using System.Linq;

namespace SME.Portal.Accounts
{
    public class MatchesResetJob
    {
        private readonly IMatchesAppService _matchesAppService;
        private List<GetMatchForViewDto> _Matches;

        public MatchesResetJob(IMatchesAppService matchesAppService)
        {
            _matchesAppService = matchesAppService;
        }

        public MatchesResetJob GetMatches(int applicationId)
        {
            var matches = AsyncHelper.RunSync(() => _matchesAppService.GetAll(new Lenders.Dtos.GetAllMatchesInput()
            {
                ApplicationIdsFilter = new List<int>() { applicationId }
            }));

            _Matches = matches.Items.ToList();

            return this;
        }

        public MatchesResetJob DeleteMatches()
        {
            foreach (var match in _Matches)
            {
                AsyncHelper.RunSync(() => _matchesAppService.HardDelete(new Abp.Application.Services.Dto.EntityDto() { Id = match.Match.Id }));
            }

            return this;
        }
    }
}
