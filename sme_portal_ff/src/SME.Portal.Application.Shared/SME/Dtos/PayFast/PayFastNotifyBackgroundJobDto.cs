using System;
using System.Collections.Generic;
using System.Text;

namespace SME.Portal.SME.Dtos.PayFast
{
    public class PayFastNotifyBackgroundJobDto
    {
        public int TenantId { get; set; }

        //
        // Summary:
        //     Unique ID on PayFast that represents the subscription
        public string token { get; set; }
        //
        // Summary:
        //     The Merchant ID as given by the PayFast system. Used to uniquely identify the
        //     receiver’s account.
        public string merchant_id { get; set; }
        //
        // Summary:
        //     The buyer’s email address
        public string email_address { get; set; }
        //
        // Summary:
        //     The buyer’s last name.
        public string name_last { get; set; }
        //
        // Summary:
        //     The buyer’s first name.
        public string name_first { get; set; }
        //
        // Summary:
        //     Number 5 in a series of 5 custom integer variables (custom_int1, custom_int2…)
        //     which can be used by the merchant as pass-through variables. They will be posted
        //     back to the merchant at the completion of the transaction.
        public string custom_int5 { get; set; }
        //
        // Summary:
        //     Number 4 in a series of 5 custom integer variables (custom_int1, custom_int2…)
        //     which can be used by the merchant as pass-through variables. They will be posted
        //     back to the merchant at the completion of the transaction.
        public string custom_int4 { get; set; }
        //
        // Summary:
        //     Number 3 in a series of 5 custom integer variables (custom_int1, custom_int2…)
        //     which can be used by the merchant as pass-through variables. They will be posted
        //     back to the merchant at the completion of the transaction.
        public string custom_int3 { get; set; }
        //
        // Summary:
        //     Number 2 in a series of 5 custom integer variables (custom_int1, custom_int2…)
        //     which can be used by the merchant as pass-through variables. They will be posted
        //     back to the merchant at the completion of the transaction.
        public string custom_int2 { get; set; }
        //
        // Summary:
        //     Number 1 in a series of 5 custom integer variables (custom_int1, custom_int2…)
        //     which can be used by the merchant as pass-through variables. They will be posted
        //     back to the merchant at the completion of the transaction.
        public string custom_int1 { get; set; }
        //
        // Summary:
        //     Number 5 in a series of 5 custom string variables (custom_str1, custom_str2…)
        //     which can be used by the merchant as pass-through variables. They will be posted
        //     back to the merchant at the completion of the transaction.
        public string custom_str5 { get; set; }
        //
        // Summary:
        //     Number 4 in a series of 5 custom string variables (custom_str1, custom_str2…)
        //     which can be used by the merchant as pass-through variables. They will be posted
        //     back to the merchant at the completion of the transaction.
        public string custom_str4 { get; set; }
        //
        // Summary:
        //     Number 3 in a series of 5 custom string variables (custom_str1, custom_str2…)
        //     which can be used by the merchant as pass-through variables. They will be posted
        //     back to the merchant at the completion of the transaction.
        public string custom_str3 { get; set; }
        //
        // Summary:
        //     Number 2 in a series of 5 custom string variables (custom_str1, custom_str2…)
        //     which can be used by the merchant as pass-through variables. They will be posted
        //     back to the merchant at the completion of the transaction.
        public string custom_str2 { get; set; }
        //
        // Summary:
        //     Number 1 in a series of 5 custom string variables (custom_str1, custom_str2…)
        //     which can be used by the merchant as pass-through variables. They will be posted
        //     back to the merchant at the completion of the transaction.
        public string custom_str1 { get; set; }
        //
        // Summary:
        //     The net amount credited to the receiver’s account.
        public string amount_net { get; set; }
        //
        // Summary:
        //     The total in fees which was deducated from the amount.
        public string amount_fee { get; set; }
        //
        // Summary:
        //     The total amount which the payer paid.
        public string amount_gross { get; set; }
        //
        // Summary:
        //     The description of the item being charged for.
        public string item_description { get; set; }
        //
        // Summary:
        //     The name of the item being charged for.
        public string item_name { get; set; }
        //
        // Summary:
        //     The status of the payment.
        public string payment_status { get; set; }
        //
        // Summary:
        //     Unique transaction ID on PayFast.
        public string pf_payment_id { get; set; }
        //
        // Summary:
        //     Unique payment ID on the merchant’s system.
        public string m_payment_id { get; set; }
        //
        // Summary:
        //     The date from which future subscription payments will be made.
        public string billing_date { get; set; }
    }
}
