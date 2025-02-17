using System;
using Abp.Application.Services.Dto;
using System.ComponentModel.DataAnnotations;

namespace SME.Portal.ConsumerCredit.Dtos
{
    public class GetCreditScoreForEditOutput
    {
        public CreateOrEditCreditScoreDto CreditScore { get; set; }

        public string UserName { get; set; }

    }
}