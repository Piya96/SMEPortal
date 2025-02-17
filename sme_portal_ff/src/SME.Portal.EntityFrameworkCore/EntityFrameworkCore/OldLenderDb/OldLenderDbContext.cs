using Microsoft.EntityFrameworkCore;
using SME.Portal.Lenders.Old;


namespace SME.Portal.EntityFrameworkCore.OldLenderDb
{
    public class OldLenderDbContext : DbContext
    {
        public DbSet<Organisation> Organisations { get; set; }
        public DbSet<FinanceProduct> FinanceProducts { get; set; }
        public DbSet<OwnershipRule> OwnershipRules { get; set; }
        public DbSet<CurrencyPair> CurrencyPairs { get; set; }

        //public string LenderDb => @"Server=tcp:ff-database-repo.database.windows.net,1433;Initial Catalog=ff_lender;Persist Security Info=False;User ID=ffwebuser;Password=F!np4552015;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=300;";
        public string LenderDb => @"Server=tcp:ff-reporting-repo.database.windows.net,1433;Initial Catalog=ff_lender;Persist Security Info=False;User ID=dbadmin;Password=D4gdTjqQ@Q#4;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=300;";

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlServer(LenderDb);
        }
    }
}
