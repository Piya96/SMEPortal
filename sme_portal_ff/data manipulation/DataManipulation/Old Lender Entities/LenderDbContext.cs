using DataManipulation.Common;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;

namespace DataManipulation.Old_Lender_Entities
{
    public class LenderDbContext : DbContext
    {
        public DbSet<Organisation> Organisations { get; set; }
        public DbSet<FinanceProduct> FinanceProducts { get; set; }
        public DbSet<OwnershipRule> OwnershipRules { get; set; }
        public DbSet<CurrencyPair> CurrencyPairs { get; set; }


        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlServer(ConnectionStrings.LenderDb);
        }
    }
}
