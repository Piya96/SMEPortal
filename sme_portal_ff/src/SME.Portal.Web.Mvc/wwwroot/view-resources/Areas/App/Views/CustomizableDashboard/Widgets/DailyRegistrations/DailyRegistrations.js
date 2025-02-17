$(function () {
    var _tenantDashboardService = abp.services.app.tenantDashboard;
    var _widgetBase = app.widgetBase.create();
    var _$Container = $('.DailyRegistrationContainer');
    var _chartFakeData = {
        labels: ["", "", "", "", "", "", ""],
        datasets: [
            {
            //label: 'Dataset 2',
            backgroundColor: '#f3f3fb',
            data: [18, 5, 10, 25, 12, 3, 35]
            }
        ]
    };


    //== Daily Registration chart.
    //** Based on Chartjs plugin - http://www.chartjs.org/
    var _chart = null;
    var initDailySales = function (dailyRegistrations, dailyRegistrationsLabels) {

        var chartData = {
            labels: dailyRegistrationsLabels,
            datasets: [{
                //label: 'Dataset 1',
                backgroundColor: '#34bfa3',
                data: dailyRegistrations
            }
                //, {
                ////label: 'Dataset 2',
                //backgroundColor: '#f3f3fb',
                //data: data
                //}
            ]
        };

        for (var i = 0; i < _$Container.length; i++) {
            var chartContainer = $(_$Container[i]).find('#m_chart_daily_registrations');
            var chartNoDataContainer = $(_$Container[i]).find('#m_chart_daily_registrations_no_data');

            if (_chart)
                _chart.destroy();

            chartNoDataContainer.hide();
            if (chartData.datasets[0].data.length <= 0) {
                chartData = _chartFakeData;
                chartNoDataContainer.show();
            }

            _chart = new Chart(chartContainer, {
                type: 'bar',
                data: chartData,
                options: {
                    title: {
                        display: false
                    },
                    tooltips: {
                        intersect: false,
                        mode: 'nearest',
                        xPadding: 10,
                        yPadding: 10,
                        caretPadding: 10
                    },
                    legend: {
                        display: false
                    },
                    responsive: true,
                    maintainAspectRatio: false,
                    barRadius: 4,
                    scales: {
                        xAxes: [{
                            display: true,
                            gridLines: false,
                            stacked: true,
                            scaleLabel: {
                                display: true,
                                labelString: 'Date'
                            },
                            ticks: {
                                display: false
                            }
                        }],
                        yAxes: [{
                            display: true,
                            stacked: true,
                            gridLines: false,
                            scaleLabel: {
                                display: true,
                                labelString: 'Registrations'
                            },
                            ticks: {
                                display: true,
                                beginAtZero: true,
                                callback: function (value) { if (Number.isInteger(value)) { return value; } }
                                //stepSize: 1
                            }
                        }]
                    },
                    layout: {
                        padding: {
                            left: 0,
                            right: 0,
                            top: 0,
                            bottom: 0
                        }
                    }
                }
            });
        }
    };

    var getDailySales = function (startDate, endDate) {
        abp.ui.setBusy(_$Container);
        _tenantDashboardService
            .getDailyRegistrations({ startDate: startDate, endDate: endDate})
            .done(function (result) {
                initDailySales(result.dailyRegistrations, result.dailyRegistrationsLabels);
            }).always(function () {
                abp.ui.clearBusy(_$Container);
            });
    };

    $('#DashboardTabList a[data-toggle="pill"]').on('shown.bs.tab', function (e) {
        _widgetBase.runDelayed(function () {
            getDailySales(null, null);
        });
    });

    abp.event.on('app.dashboardFilters.DateRangePicker.OnDateChange', function (_selectedDates) {
        _widgetBase.runDelayed(function () {
            getDailySales(_selectedDates.startDate, _selectedDates.endDate);
        });
    });
});