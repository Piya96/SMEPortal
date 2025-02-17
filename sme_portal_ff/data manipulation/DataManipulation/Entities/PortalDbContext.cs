using DataManipulation.Common;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;

namespace DataManipulation.Entities
{
    public class PortalDbContext: DbContext
    {
        public DbSet<Lender> Lenders { get; set; }
        public DbSet<FinanceProduct> FinanceProducts { get; set; }

        public DbSet<CurrencyPair> CurrencyPairs { get; set; }


        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlServer(ConnectionStrings.PortalDb);
        }
    }
}
