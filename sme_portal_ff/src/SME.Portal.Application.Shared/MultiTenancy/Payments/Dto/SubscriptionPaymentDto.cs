﻿using Abp.Application.Services.Dto;
using Abp.Authorization.Users;
using SME.Portal.Editions;
using System;

namespace SME.Portal.MultiTenancy.Payments.Dto
{
    public class SubscriptionPaymentDto : EntityDto<long>
    {
        public string Description { get; set; }

        public SubscriptionPaymentGatewayType Gateway { get; set; }

        public decimal Amount { get; set; }

        public int EditionId { get; set; }

        public int TenantId { get; set; }

        public long? UserId { get; set; }

        public int DayCount { get; set; }

        public PaymentPeriodType PaymentPeriodType { get; set; }

        public string PaymentId { get; set; }

        public string PayerId { get; set; }

        public string EditionDisplayName { get; set; }

        public string InvoiceNo { get; set; }

        public SubscriptionPaymentStatus Status { get; set; }

        public bool IsRecurring { get; set; }
        
        public string ExternalPaymentId { get; set; }

        public string ExternalPaymentToken { get; set; }

        public string SuccessUrl { get; set; }

        public string ErrorUrl { get; set; }

        public EditionPaymentType EditionPaymentType { get; set; }

        public DateTime CreationTime { get; set; }
    }
}
