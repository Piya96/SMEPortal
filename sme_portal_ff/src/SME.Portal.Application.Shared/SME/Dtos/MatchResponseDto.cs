using SME.Portal.Lenders.Dtos;
using System.Collections.Generic;

namespace SME.Portal.SME.Dtos
{
    public class MatchResponseDto
    {
        public MatchResponseDto()
        {

        }

        public string MatchingCriteriaListId { get; set; }
        public IEnumerable<FinanceProductCriteriaDto> MatchedLenders { get; set; }

        public MatchResponseDto(string criteriaListId)
        {
            MatchingCriteriaListId = criteriaListId;
            MatchedLenders = new List<FinanceProductCriteriaDto>();
        }
    }
}
