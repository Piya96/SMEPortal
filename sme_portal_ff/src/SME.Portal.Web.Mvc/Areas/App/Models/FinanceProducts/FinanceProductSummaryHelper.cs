using SME.Portal.Lenders.Helpers;
using SME.Portal.List.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SME.Portal.Web.Areas.App.Models.FinanceProducts
{
    public class FinanceProductSummaryHelper
    {
        public static string GetSummaryLists(List<ListItemDto> list, string selectedIds)
        {
            if (!string.IsNullOrEmpty(selectedIds))
            {
                return string.Join(';', list.Where(a => selectedIds.Contains(a.ListId)).Select(a => a.Name));
            }

            return string.Empty;
        }

        public static string GetCheckedStatus(DateTime dateChecked)
        {
            var summaryStatus = "summarygreen";

            var dayDifference = (DateTimeExt.GetSaNow() - dateChecked).Days;
            var message = $"Checked recently ({dateChecked:dd-MM-yyyy}) {dayDifference} days since last checked.";


            if (dayDifference >= 31 && dayDifference <= 38)
            {
                summaryStatus = "summarywarn";
                message = $"Checking due ({dateChecked:dd-MM-yyyy}) {dayDifference} days since last checked.";
            }
            else if (dayDifference >= 39 && dayDifference <= 46)
            {
                summaryStatus = "summarypurple";
                message = $"Checking overdue ({dateChecked:dd-MM-yyyy}) {dayDifference} days since last checked.";
            }
            else if (dayDifference >= 47)
            {
                summaryStatus = "summaryred";
                message = $"Emergency checking required ({dateChecked:dd-MM-yyyy}) {dayDifference} days since last checked.";
            }

            return $"<div class='{summaryStatus}'>{message}</div>";
        }
    }
}
