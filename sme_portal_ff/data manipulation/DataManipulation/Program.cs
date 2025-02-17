using AutoMapper;
using DataManipulation.Entities;
using DataManipulation.Models;
using DataManipulation.Old_Lender_Entities;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace DataManipulation
{
    class Program
    {
        private static PortalDbContext SMEPortalDbCtx { get; set; }
        private static LenderDbContext LenderDbCtx { get; set; }
        private static IMapper Mapper { get; set; }

        static void Main(string[] args)
        {
            SMEPortalDbCtx = new PortalDbContext();
            LenderDbCtx = new LenderDbContext();

            CreateMapping();

            // NB: Ensure TenantId is set correctly!
            MigrateFinanceProducts(tenantId: 2, deleteLocal: true);
            
            Console.WriteLine("Migration Complete");
        }

        private static void CreateMapping()
        {
            var config = new MapperConfiguration(cfg =>
            {
                cfg.CreateMap<Old_Lender_Entities.FinanceProduct, MatchCriteria>();
                cfg.CreateMap<OwnershipRule, OwnershipRuleMatchingCriteria>();
            });

            Mapper = config.CreateMapper();
        }

        public static void MigrateFinanceProducts(int tenantId = 2, bool deleteLocal = true)
        {
            if (deleteLocal)
                DeleteEntities();

            var oldLenders = LenderDbCtx.Organisations.Include(a => a.FinanceProducts).ToList();
            var oldCurrencyPairs = LenderDbCtx.CurrencyPairs.ToList();
            var newCurrencyPairs = SMEPortalDbCtx.CurrencyPairs.ToList();

            // Migrate Lenders and associated FinanceProducts
            foreach(var oldLender in oldLenders)
            {
                Console.WriteLine($"Adding FinanceProducts for Lender.Name:{oldLender.Name}");

                // add lenders
                var smeLender = SMEPortalDbCtx.Lenders.Add(new Lender()
                {
                    Name = oldLender.Name,
                    WebsiteUrl = oldLender.WebsiteUrl,
                    Permalink = oldLender.Permalink,
                    LogoName = oldLender.LogoName,
                    FSPRegistrationNumber = oldLender.FspRegistrationNumber,
                    IsSection12J = oldLender.IsSection12J,
                    NcrNumber = oldLender.NcrNumber,
                    CreationTime = DateTime.Now,
                    IsDeleted = false
                });

                SMEPortalDbCtx.SaveChanges();

                foreach (var oldFinanceProduct in oldLender.FinanceProducts)
                {
                    var ownershipRules = LenderDbCtx.OwnershipRules.Where(a => a.FinanceProductId == oldFinanceProduct.Id).ToList();

                    var matchCriteria = Mapper.Map<MatchCriteria>(oldFinanceProduct);
                    matchCriteria.OwnershipRules = ownershipRules.Select(Mapper.Map<OwnershipRuleMatchingCriteria>).ToList();

                    if (matchCriteria.IsDeleted)
                    {
                        Console.WriteLine($"FinanceProduct.Name:{oldFinanceProduct.Name} for Lender.Id:{smeLender.Entity.Id} is marked as Deleted");
                    }

                    int? newCurrencyPairId = null;

                    if (oldFinanceProduct.CurrencyPairId != null)
                    {
                        var oldCurrencyPair = oldCurrencyPairs.FirstOrDefault(x => x.Id == oldFinanceProduct.CurrencyPairId);

                        var newCurrencyPair = newCurrencyPairs.FirstOrDefault(x => x.BaseCurrencyCode == oldCurrencyPair.BaseCurrencyCode && x.TargetCurrencyCode == oldCurrencyPair.TargetCurrencyCode);
                        
                        newCurrencyPairId = newCurrencyPair.Id;
                    }

                    SMEPortalDbCtx.FinanceProducts.Add(new Entities.FinanceProduct()
                    {
                        Name = oldFinanceProduct.Name,
                        VersionLabel = oldFinanceProduct.Id.ToString(),
                        Version = 0,
                        MatchCriteriaJson = JsonConvert.SerializeObject(matchCriteria),
                        SummaryHtml = oldFinanceProduct.Summary,
                        CreationTime = DateTime.Now,
                        LenderId = smeLender.Entity.Id,
                        Permalink = smeLender.Entity.Permalink,
                        ShowMatchResults = !oldFinanceProduct.HideOnResultScreen,
                        CurrencyPairId = newCurrencyPairId,
                        TenantId = tenantId,
                        Enabled = !oldFinanceProduct.IsDisabled,
                        IsDeleted = oldFinanceProduct.IsDeleted
                    });
                }

                SMEPortalDbCtx.SaveChanges();

                Console.WriteLine($"Completed adding {oldLender.FinanceProducts.Count} FinanceProducts for Lender.Name:{oldLender.Name}");
            }
        }

        private static void DeleteEntities()
        {
            var financeProductsAll = SMEPortalDbCtx.FinanceProducts.Select(a => new Entities.FinanceProduct() { Id = a.Id }).ToList();
            SMEPortalDbCtx.FinanceProducts.RemoveRange(financeProductsAll);
            
            var lendersAll = SMEPortalDbCtx.Lenders.Select(a => new Entities.Lender() { Id = a.Id }).ToList();
            SMEPortalDbCtx.Lenders.RemoveRange(lendersAll);
            
            SMEPortalDbCtx.SaveChanges();
        }

    }
}
