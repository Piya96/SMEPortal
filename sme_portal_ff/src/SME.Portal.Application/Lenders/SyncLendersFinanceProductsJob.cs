using Abp.Dependency;
using Abp.Domain.Repositories;
using Abp.Domain.Uow;
using Abp.Threading.BackgroundWorkers;
using Abp.Threading.Timers;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using SME.Portal.EntityFrameworkCore.OldLenderDb;
using SME.Portal.Lenders.Old;
using SME.Portal.Lenders.SyncModels;
using System;
using System.Diagnostics;
using System.Linq;

namespace SME.Portal.Lenders
{
    public class SyncLendersFinanceProductsJob : PeriodicBackgroundWorkerBase, ISingletonDependency
    {
        private OldLenderDbContext LenderDbCtx { get; set; }
        private IMapper Mapper { get; set; }
        private readonly IRepository<Currency.CurrencyPair, int> _currencyPairRepo;
        private readonly IRepository<FinanceProduct, int> _financeProductRepo;
        private readonly IRepository<Lender, int> _lendersRepo;
        private int _tenantId;
        private readonly Guid _sefaLenderId = Guid.Parse("9683F6B8-F61C-4A6C-8077-B209295A388C");

        public SyncLendersFinanceProductsJob(AbpTimer timer, IRepository<Currency.CurrencyPair, int> currencyPairRepo,
                                                             IRepository<FinanceProduct, int> financeProductRepo,
                                                             IRepository<Lender, int> lendersRepo)
            : base(timer)
        {
            Timer.Period = MinutesToMilliseconds(60);

            LenderDbCtx = new OldLenderDbContext();

            _currencyPairRepo = currencyPairRepo;
            _financeProductRepo = financeProductRepo;
            _lendersRepo = lendersRepo;
            _tenantId = 2;
        }

        [UnitOfWork]
        protected override void DoWork()
        {
            try
            {
                var timer = new Stopwatch();
                timer.Start();

                Logger.Info($"SyncLendersFinanceProductsJob Started");

                using (CurrentUnitOfWork.DisableFilter(AbpDataFilters.SoftDelete))
                {
                    CreateMapping();

                    var oldLenders = LenderDbCtx.Organisations.Include(a => a.FinanceProducts).ToList();
                    var oldCurrencyPairs = LenderDbCtx.CurrencyPairs.ToList();
                    var newLenderId = 0;

                    foreach (var oldlender in oldLenders)
                    {
                        #region create or update lender
                        //This won't work on the first sync due to no ids being populated but thereafter should work and the below code can then be removed
                        var newLender = _lendersRepo.FirstOrDefault(x => x.VersionLabel == oldlender.Id.ToString());

                        //This can be removed once there has been at least one sync of this code live. This is to populate the lender ID onto existing lenders
                        if (newLender == null)
                            newLender = _lendersRepo.FirstOrDefault(x => x.Name == oldlender.Name);

                        if (newLender != null)
                        {
                            newLenderId = newLender.Id;
                            newLender.WebsiteUrl = oldlender.WebsiteUrl;
                            newLender.FSPRegistrationNumber = oldlender.FspRegistrationNumber;
                            newLender.NcrNumber = oldlender.NcrNumber;
                            newLender.LastModificationTime = DateTime.Now;
                            //Can be removed once there has been at least one sync live. This is to populate the lender ID onto existing lenders
                            newLender.VersionLabel = oldlender.Id.ToString();

                        }
                        else
                        {
                            newLenderId = _lendersRepo.InsertAndGetId(new Lender()
                            {
                                Name = oldlender.Name,
                                WebsiteUrl = oldlender.WebsiteUrl,
                                FSPRegistrationNumber = oldlender.FspRegistrationNumber,
                                NcrNumber = oldlender.NcrNumber,
                                CreationTime = DateTime.Now,
                                IsDeleted = false,
                                VersionLabel = oldlender.Id.ToString()
                            });

                            newLender = _lendersRepo.Get(newLenderId);
                        }
                        #endregion

                        #region create or update financeproducts

                        foreach (var oldFinanceProduct in oldlender.FinanceProducts)
                        {
                            // get ownershiprules
                            var ownershipRules = LenderDbCtx.OwnershipRules.Where(a => a.FinanceProductId == oldFinanceProduct.Id).ToList();

                            // get matchcriteria
                            var matchCriteria = Mapper.Map<MatchCriteria>(oldFinanceProduct);
                            matchCriteria.OwnershipRules = ownershipRules.Select(Mapper.Map<OwnershipRuleMatchingCriteria>).ToList();

                            if (matchCriteria.IsDeleted)
                                Logger.Info($"FinanceProduct.Name:{oldFinanceProduct.Name} for Lender.Id:{newLender.Id} is marked as Deleted");

                            // get currencyPair
                            int? newCurrencyPairId = null;

                            if (oldFinanceProduct.CurrencyPairId != null)
                            {
                                var oldCurrencyPair = oldCurrencyPairs.FirstOrDefault(x => x.Id == oldFinanceProduct.CurrencyPairId);
                                var newCurrencyPair = _currencyPairRepo.FirstOrDefault(x => x.BaseCurrencyCode == oldCurrencyPair.BaseCurrencyCode && x.TargetCurrencyCode == oldCurrencyPair.TargetCurrencyCode);
                                newCurrencyPairId = newCurrencyPair.Id;
                            }

                            var newFinanceProduct = _financeProductRepo.FirstOrDefault(x => x.VersionLabel.ToLower() == oldFinanceProduct.Id.ToString().ToLower());

                            // Separate Sefa Finance Products to Sefa Tenant
                            if (oldFinanceProduct.OrganisationId == _sefaLenderId)
                            {
                                _tenantId = 3;
                            }
                            else
                            {
                                _tenantId = 2;
                            }

                            if (newFinanceProduct != null)
                            {
                                newFinanceProduct.Name = oldFinanceProduct.Name;
                                newFinanceProduct.TenantId = _tenantId;
                                newFinanceProduct.MatchCriteriaJson = JsonConvert.SerializeObject(matchCriteria);
                                newFinanceProduct.SummaryHtml = oldFinanceProduct.Summary;
                                newFinanceProduct.ShowMatchResults = !oldFinanceProduct.HideOnResultScreen;
                                newFinanceProduct.CurrencyPairId = newCurrencyPairId;
                                newFinanceProduct.Enabled = !oldFinanceProduct.IsDisabled;
                                newFinanceProduct.IsDeleted = oldFinanceProduct.IsDeleted;
                                newFinanceProduct.LastModificationTime = DateTime.Now;
                                newFinanceProduct.LastCheckedDate = oldFinanceProduct.LastCheckedDate;
                                newFinanceProduct.StatusClassificationId = oldFinanceProduct.StatusClassificationId;
                            }
                            else
                            {
                                _financeProductRepo.InsertAndGetId(new FinanceProduct()
                                {
                                    Name = oldFinanceProduct.Name,
                                    VersionLabel = oldFinanceProduct.Id.ToString(),
                                    MatchCriteriaJson = JsonConvert.SerializeObject(matchCriteria),
                                    SummaryHtml = oldFinanceProduct.Summary,
                                    CreationTime = DateTime.Now,
                                    LenderId = newLender.Id,
                                    ShowMatchResults = !oldFinanceProduct.HideOnResultScreen,
                                    CurrencyPairId = newCurrencyPairId,
                                    TenantId = _tenantId,
                                    Enabled = !oldFinanceProduct.IsDisabled,
                                    IsDeleted = oldFinanceProduct.IsDeleted,
                                    LastCheckedDate = oldFinanceProduct.LastCheckedDate,
                                    StatusClassificationId = oldFinanceProduct.StatusClassificationId
                                });
                            }

                        }

                        #endregion
                        CurrentUnitOfWork.SaveChanges();
                    }

                }

                timer.Stop();

                Logger.Info($"SyncLendersFinanceProductsJob Stopped - Time taken {timer.Elapsed.ToString(@"dd\.hh\:mm\:ss")}");
            }
            catch (Exception x)
            {
                Logger.Error($"SyncLendersFinanceProductsJob failed with exception.Message:{x.Message}");
            }

        }

        private void CreateMapping()
        {
            var config = new MapperConfiguration(cfg =>
            {
                cfg.CreateMap<Old.FinanceProduct, MatchCriteria>();
                cfg.CreateMap<OwnershipRule, OwnershipRuleMatchingCriteria>();
            });

            Mapper = config.CreateMapper();
        }

        private void DeleteEntities()
        {
            var financeProductsAll = _financeProductRepo.GetAll().ToList();

            foreach (var fp in financeProductsAll)
                _financeProductRepo.Delete(fp);

            var lendersAll = _lendersRepo.GetAll().ToList();
            foreach (var lender in lendersAll)
                _lendersRepo.Delete(lender);
        }

        private int MinutesToMilliseconds(int minutes)
        {
            return minutes * 60 * 1000;
        }
    }
}
