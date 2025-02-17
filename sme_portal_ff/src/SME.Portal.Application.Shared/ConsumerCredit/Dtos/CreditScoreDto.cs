using System;
using Abp.Application.Services.Dto;

namespace SME.Portal.ConsumerCredit.Dtos
{
    public class CreditScoreDto : EntityDto
    {
		public string Status { get; set; }

        public int Score { get; set; }

        public DateTime EnquiryDate { get; set; }

        public long UserId { get; set; }

    }
}