using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using SME.Portal.MultiTenancy.HostDashboard.Dto;

namespace SME.Portal.MultiTenancy.HostDashboard
{
    public interface IIncomeStatisticsService
    {
        Task<List<IncomeStastistic>> GetIncomeStatisticsData(DateTime startDate, DateTime endDate,
            ChartDateInterval dateInterval);
    }
}