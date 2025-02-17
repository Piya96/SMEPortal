using SME.Portal.Common.Dto;
using SME.Portal.Company.Dtos;
using SME.Portal.List.Dtos;
using SME.Portal.SME.Dtos.Applications;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Globalization;

namespace SME.Portal.SME.Dtos
{
	public class SubmitToECDCDto
	{
		public int ApplicationId { get; set; }
		public string CompanyName { get; set; }
		public string ProductMatched { get; set; }
		public string RegionalOffice { get; set; }
	}
}
