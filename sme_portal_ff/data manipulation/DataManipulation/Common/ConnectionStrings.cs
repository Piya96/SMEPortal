using System;
using System.Collections.Generic;
using System.Text;

namespace DataManipulation.Common
{
    public static class ConnectionStrings
    {
        //public static string LenderDb => @"Server=tcp:ff-database-repo.database.windows.net,1433;Initial Catalog=ff_lender;Persist Security Info=False;User ID=ffwebuser;Password=;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=300;";
        public static string LenderDb => @"Server=tcp:ff-reporting-repo.database.windows.net,1433;Initial Catalog=ff_lender;Persist Security Info=False;User ID=dbadmin;Password=;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=300;";
        public static string PortalDb => @"Server=localhost; Database=SMEPortalDb; Trusted_Connection=True;";
    }
}
