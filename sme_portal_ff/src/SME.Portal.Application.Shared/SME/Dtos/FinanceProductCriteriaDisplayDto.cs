using System;
using System.Collections.Generic;
using System.Text;

namespace SME.Portal.SME.Dtos
{
    public class FinanceProductCriteriaDisplayDto
    {
        public string FinanceFor { get; set; }
        public string IndustrySectorTopLevels { get; set; }
        public string IndustrySectorSecondaryLevels { get; set; }
        public string CompanyRegistrationTypes { get; set; }
		public string ProvinceListIds { get; set; }
		public string CustomerTypeListIds { get; set; }
	}
}
