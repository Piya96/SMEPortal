﻿using System;
using System.Collections.Generic;
using System.Text;

namespace SME.Portal.SME.Dtos.Applications
{
    public class PurchaseOrderFundingDto
    {
        public int? FundingAmount { get; set; }
        public string CustomerProfileListId { get; set; }
        public bool? Experience { get; set; }
        public string CustomerProfile { get; internal set; }
    }
}
