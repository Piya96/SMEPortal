using System;
using System.Collections.Generic;
using System.Text;

namespace SME.Portal.ConsumerProfileBureau.Dtos
{
    public class CreditReportRequestDto
    {
		public string IdentityNumber { get; set; }
		public string Dob { get; set; }
		public string FirstName { get; set; }
		public string Surname { get; set; }
		public string EnquiryReason { get; set; }
		public string EnquiryDoneBy { get; set; }
	}
}
