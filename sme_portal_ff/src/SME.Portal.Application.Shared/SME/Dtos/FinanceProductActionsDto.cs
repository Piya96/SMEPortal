using System.Collections.Generic;

namespace SME.Portal.FinanceProductActions.Dtos
{
	public class MatchResultDto
	{
		public int ApplicationId { get; set; }
		public int MatchId { get; set; }
		public string Status { get; set; }
		public string Ids { get; set; }
	}

	public class MatchListResultDto
	{
		public List<MatchResultDto> Matches { get; set; }
	}

	public class MatchEditResultDto
	{
		public int Id { get; set; }
		public string Json { get; set; }
	}

	public class MatchEditDto
	{
		public int ApplicationId { get; set; }
		public decimal LoanAmount { get; set; }
		public decimal AnnualTurnover { get; set; }
	}

	public class MatchDeleteDto
	{
		public int ApplicationId { get; set; }
		public int MatchId { get; set; }
	}
}
