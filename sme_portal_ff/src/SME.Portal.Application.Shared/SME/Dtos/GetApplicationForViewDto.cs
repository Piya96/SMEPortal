using System.Collections.Generic;

namespace SME.Portal.SME.Dtos
{
    public class GetApplicationForViewDto
    {
        public ApplicationDto Application { get; set; }

        public string UserName { get; set; }

        public string SmeCompanyName { get; set; }

	}

	////public class FinanceProductMatchDto
	////{
	////	public int ApplicationId { get; set; }
	////	public string Status { get; set; }
	////	public string Ids { get; set; }
	////}
	////
	////public class FinanceProductMatchListDto
	////{
	////	public List<FinanceProductMatchDto> Matches { get; set; }
	////}
}