using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using SME.Portal.List.Dtos;

namespace SME.Portal.Web.Areas.App.Models.ConsumerCredit
{
    public class ConsumerCreditViewModel
    {
        public int CreditScore { get; set; }
                
        public DateTime? CreditScoreEnquiryDate { get; set; }

        public DateTime? CreditScoreNextEnquiryDate { get; set; }

        public DateTime? CreditReportEnquiryDate { get; set; }

        public DateTime? CreditReportNextEnquiryDate { get; set; }

		public string IdentityNumber { get; set; }
        public bool HasApplications { get; internal set; }
        public bool HasOnboarded { get; internal set; }

		public string FirstName { get; set; }
		public string Surname { get; set; }

		public List<ListItemDto> ListItems { get; set; }
	}

	public class ConsumerCreditPartialModel
	{
		public string InputWidth { get; set; }
	}


	public class JsonBlobViewModel
	{
		public string JsonBlob { get; set; }
	}
}
