using Abp.Dependency;
using Abp.Domain.Repositories;
using Abp.Domain.Uow;
using Abp.Threading;
using Abp.Threading.BackgroundWorkers;
using Abp.Threading.Timers;
using Abp.Timing;
using Newtonsoft.Json;
using SME.Portal.Currency.Dtos;
using SME.Portal.Helpers;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text;

namespace SME.Portal.Currency
{
    public class CurrencyPairUpdateWorkerJob : PeriodicBackgroundWorkerBase, ISingletonDependency
    {
        private readonly IRepository<CurrencyPair, int> _currencyPairRepository;

        public CurrencyPairUpdateWorkerJob(AbpTimer timer, IRepository<CurrencyPair, int> currencyPairRepository)
            : base(timer)
        {
            _currencyPairRepository = currencyPairRepository;
            //Timer.Period = 5000;    //5 seconds for testing
            Timer.Period = 10800000;  //3 hour to keep it under openexchange api limits
        }

        [UnitOfWork]
        protected override void DoWork()
        {
            using (CurrentUnitOfWork.DisableFilter(AbpDataFilters.MayHaveTenant))
            {
                var allCurrencyPairs = _currencyPairRepository.GetAll();

                var openExchangeRates = GetOpenExchangeRates();

                if (!openExchangeRates.Rates.TryGetValue("ZAR", out double zarRate))
                {
                    Logger.Error($"Failed to retrieve base ZAR rate from OpenExchangeRates");
                }
                else
                {
                    foreach (var currencyPair in allCurrencyPairs)
                    {
                        var currencyName = currencyPair.Name.Split('/')[1];

                        if (openExchangeRates.Rates.TryGetValue(currencyName, out double rate))
                        {
                            if (rate != 0)
                            {
                                currencyPair.ExchangeRate = (decimal)(zarRate / rate);

                                _currencyPairRepository.Update(currencyPair);

                                Logger.Debug($"Updating CurrencyPair:{currencyPair.Name} with ExchangeRate:{ currencyPair.ExchangeRate }");
                            }
                        }

                    }
                }

                CurrentUnitOfWork.SaveChanges();
            }
        }

        private OpenExchangeRatesDto GetOpenExchangeRates()
        {
            // create the CPB APIM url 
            var uriBuilder = new UriBuilder(UriHelper.CombineUri("https://openexchangerates.org/api/", $"latest.json?app_id=c4f0eaedcaf849d18ca9792f2a3c5ed4"));

            // create a query
            HttpClient httpClient = new HttpClient();

            HttpRequestMessage httpRequest = new HttpRequestMessage
            {
                RequestUri = uriBuilder.Uri,
                Method = HttpMethod.Get
            };

            HttpResponseMessage response = AsyncHelper.RunSync(() => httpClient.SendAsync(httpRequest));
            var jsonResponse = AsyncHelper.RunSync(() => response.Content.ReadAsStringAsync());

            return OpenExchangeRatesDto.FromJson(jsonResponse);
        }
    }
}
