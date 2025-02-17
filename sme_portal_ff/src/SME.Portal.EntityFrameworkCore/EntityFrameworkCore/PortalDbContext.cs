using SME.Portal.Sme.Subscriptions;
using SME.Portal.Documents;
using SME.Portal.List;
using SME.Portal.ConsumerCredit;
using SME.Portal.Company;
using SME.Portal.SME;
using SME.Portal.Lenders;
using SME.Portal.Currency;
using Abp.IdentityServer4;
using Abp.Organizations;
using Abp.Zero.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using SME.Portal.Authorization.Delegation;
using SME.Portal.Authorization.Roles;
using SME.Portal.Authorization.Users;
using SME.Portal.Chat;
using SME.Portal.Editions;
using SME.Portal.Friendships;
using SME.Portal.MultiTenancy;
using SME.Portal.MultiTenancy.Accounting;
using SME.Portal.MultiTenancy.Payments;
using SME.Portal.Storage;

namespace SME.Portal.EntityFrameworkCore
{
    public class PortalDbContext : AbpZeroDbContext<Tenant, Role, User, PortalDbContext>, IAbpPersistedGrantDbContext
    {
        public virtual DbSet<OwnerCompanyMap> OwnerCompanyMapping { get; set; }

        public virtual DbSet<SmeSubscription> SmeSubscriptions { get; set; }

        public virtual DbSet<Document> Documents { get; set; }

        public virtual DbSet<ListItem> ListItems { get; set; }

        public virtual DbSet<CreditReport> CreditReports { get; set; }

        public virtual DbSet<CreditScore> CreditScores { get; set; }

        public virtual DbSet<SmeCompany> SmeCompanies { get; set; }

        public virtual DbSet<Owner> Owners { get; set; }

        public virtual DbSet<Application> Applications { get; set; }

        public virtual DbSet<Match> Matches { get; set; }

        public virtual DbSet<FinanceProduct> FinanceProducts { get; set; }

        public virtual DbSet<Contract> Contracts { get; set; }

        public virtual DbSet<Lender> Lenders { get; set; }

        public virtual DbSet<CurrencyPair> CurrencyPairs { get; set; }

        /* Define an IDbSet for each entity of the application */

        public virtual DbSet<BinaryObject> BinaryObjects { get; set; }

        public virtual DbSet<Friendship> Friendships { get; set; }

        public virtual DbSet<ChatMessage> ChatMessages { get; set; }

        public virtual DbSet<SubscribableEdition> SubscribableEditions { get; set; }

        public virtual DbSet<SubscriptionPayment> SubscriptionPayments { get; set; }

        public virtual DbSet<Invoice> Invoices { get; set; }

        public virtual DbSet<PersistedGrantEntity> PersistedGrants { get; set; }

        public virtual DbSet<SubscriptionPaymentExtensionData> SubscriptionPaymentExtensionDatas { get; set; }

        public virtual DbSet<UserDelegation> UserDelegations { get; set; }

        public virtual DbSet<Comment> Comment { get; set; }

        public virtual DbSet<Countries> Countries { get; set; }

        public virtual DbSet<LendersComment> LendersComment { get; set; }

        public virtual DbSet<FinanceProductComment> FinanceProductComment { get; set; }

        public virtual DbSet<FundForms> FundForms { get; set; }

        public virtual DbSet<FinanceProductView> FinanceProductViews { get; set; }

        public virtual DbSet<WebsiteUrl> WebsiteUrl { get; set; }

        public virtual DbSet<ResearchUrl> ResearchUrl { get; set; }
        
        public virtual DbSet<FundFormDraftView> FundFormDraftViews { get; set; }

        public PortalDbContext(DbContextOptions<PortalDbContext> options)
            : base(options)
        {

        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<SmeSubscription>(s =>
            {
                s.HasIndex(e => new { e.TenantId });
            });
            modelBuilder.Entity<OwnerCompanyMap>(o =>
                       {
                           o.HasIndex(e => new { e.TenantId });
                       });
            modelBuilder.Entity<SmeCompany>(s =>
                       {
                           s.HasIndex(e => new { e.TenantId });
                       });
            modelBuilder.Entity<Owner>(o =>
                       {
                           o.HasIndex(e => new { e.TenantId });
                       });
            modelBuilder.Entity<SmeSubscription>(s =>
                       {
                           s.HasIndex(e => new { e.TenantId });
                       });
            modelBuilder.Entity<Owner>(o =>
                       {
                           o.HasIndex(e => new { e.TenantId });
                       });
            modelBuilder.Entity<SmeCompany>(s =>
                       {
                           s.HasIndex(e => new { e.TenantId });
                       });
            modelBuilder.Entity<Document>(d =>
                       {
                           d.HasIndex(e => new { e.TenantId });
                       });
            modelBuilder.Entity<Match>(m =>
                       {
                           m.HasIndex(e => new { e.TenantId });
                       });
            modelBuilder.Entity<FinanceProduct>(f =>
                       {
                           f.HasIndex(e => new { e.TenantId });
                           f.HasIndex(e => new { e.AssignedTo });
                           //f.HasIndex(e=> new { e.TenantId,e.LenderId,e.Name}).IsUnique(true);
                       });
            modelBuilder.Entity<Lender>(f =>
            {
                f.HasIndex(e => new { e.TenantId, e.Name }).IsUnique(true);
                //f.HasIndex(e => new { e.Name }).IsUnique(true);
            });

            modelBuilder.Entity<FinanceProductComment>(f =>
            {
                f.HasIndex(e => new { e.FinanceProductId, e.Text }).IsUnique(true);
            });
            modelBuilder.Entity<LendersComment>(f =>
            {
                f.HasIndex(e => new { e.LenderId, e.Text }).IsUnique(true);
            });

            modelBuilder.Entity<Match>(m =>
                       {
                           m.HasIndex(e => new { e.TenantId });
                       });
            modelBuilder.Entity<ListItem>(l =>
                       {
                           l.HasIndex(e => new { e.TenantId });
                       });
            modelBuilder.Entity<SmeCompany>(s =>
                       {
                           s.HasIndex(e => new { e.TenantId });
                       });
            modelBuilder.Entity<CreditReport>(c =>
                       {
                           c.HasIndex(e => new { e.TenantId });
                       });
            modelBuilder.Entity<CreditScore>(c =>
                       {
                           c.HasIndex(e => new { e.TenantId });
                       });
            modelBuilder.Entity<FinanceProduct>(f =>
                       {
                           f.HasIndex(e => new { e.TenantId });
                           f.HasIndex(e => new { e.AssignedTo });
                       });
            modelBuilder.Entity<Lender>(f =>
            {
                f.HasIndex(e => new { e.TenantId,e.Name }).IsUnique(true);
                //f.HasIndex(e => new { e.Name }).IsUnique(true);
            });
            modelBuilder.Entity<SmeCompany>(s =>
                       {
                           s.HasIndex(e => new { e.TenantId });
                       });
            modelBuilder.Entity<Owner>(o =>
                       {
                           o.HasIndex(e => new { e.TenantId });
                       });
            modelBuilder.Entity<Match>(m =>
                       {
                           m.HasIndex(e => new { e.TenantId });
                       });

            //modelBuilder.Entity<Match>()
            //    .HasMany(c => c.MatchedFinanceProducts)
            //    .WithOne(e => e.Match)
            //    .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<Application>(a =>
            {
                a.HasIndex(e => new { e.TenantId });
            });

            modelBuilder.Entity<BinaryObject>(b =>
            {
                b.HasIndex(e => new { e.TenantId });
            });

            modelBuilder.Entity<ChatMessage>(b =>
            {
                b.HasIndex(e => new { e.TenantId, e.UserId, e.ReadState });
                b.HasIndex(e => new { e.TenantId, e.TargetUserId, e.ReadState });
                b.HasIndex(e => new { e.TargetTenantId, e.TargetUserId, e.ReadState });
                b.HasIndex(e => new { e.TargetTenantId, e.UserId, e.ReadState });
            });

            modelBuilder.Entity<Friendship>(b =>
            {
                b.HasIndex(e => new { e.TenantId, e.UserId });
                b.HasIndex(e => new { e.TenantId, e.FriendUserId });
                b.HasIndex(e => new { e.FriendTenantId, e.UserId });
                b.HasIndex(e => new { e.FriendTenantId, e.FriendUserId });
            });

            modelBuilder.Entity<Tenant>(b =>
            {
                b.HasIndex(e => new { e.SubscriptionEndDateUtc });
                b.HasIndex(e => new { e.CreationTime });
            });

            modelBuilder.Entity<SubscriptionPayment>(b =>
            {
                b.HasIndex(e => new { e.Status, e.CreationTime });
                b.HasIndex(e => new { PaymentId = e.ExternalPaymentId, e.Gateway });
            });

            modelBuilder.Entity<SubscriptionPaymentExtensionData>(b =>
            {
                b.HasQueryFilter(m => !m.IsDeleted)
                    .HasIndex(e => new { e.SubscriptionPaymentId, e.Key, e.IsDeleted })
                    .IsUnique();
            });

            modelBuilder.Entity<UserDelegation>(b =>
            {
                b.HasIndex(e => new { e.TenantId, e.SourceUserId });
                b.HasIndex(e => new { e.TenantId, e.TargetUserId });
            });

            modelBuilder.ConfigurePersistedGrantEntity();
        }
    }
}