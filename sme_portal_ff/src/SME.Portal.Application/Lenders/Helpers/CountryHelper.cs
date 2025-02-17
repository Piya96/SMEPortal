using System;
using System.Collections.Generic;
using System.Text;

namespace SME.Portal.Lenders.Helpers
{
    public static class CountryHelper
    {
        public static string SubSaharanAfrica => "5b572f32669f777ecca1fcd9,5b572f3b669f777ecca1fce6,5b572f3d669f777ecca1fce9," +
                                         "5b572f40669f777ecca1fcee,5b572f41669f777ecca1fcef,5b572f43669f777ecca1fcf2," +
                                         "5b572f41669f777ecca1fcf0,5b572f44669f777ecca1fcf4,5b572f45669f777ecca1fcf5," +
                                         "5b572f46669f777ecca1fcf8,5b572f47669f777ecca1fcfa,5b572f47669f777ecca1fcf9," +
                                         "5b572f49669f777ecca1fcfc,5b572f4c669f777ecca1fd01,5b572f4f669f777ecca1fd07," +
                                         "5b572f50669f777ecca1fd0a,5b572f51669f777ecca1fd0b,5b572f52669f777ecca1fd0f," +
                                         "5b572f53669f777ecca1fd12,5b572f54669f777ecca1fd13,5b572f55669f777ecca1fd17," +
                                         "5b572f56669f777ecca1fd1a,5b572f5c669f777ecca1fd29,5b572f60669f777ecca1fd31," +
                                         "5b572f62669f777ecca1fd34,5b572f65669f777ecca1fd3a,5b572f65669f777ecca1fd39," +
                                         "5b572f68669f777ecca1fd3d,5b572f6a669f777ecca1fd40,5b572f6b669f777ecca1fd42," +
                                         "5b572f6f669f777ecca1fd49,5b572f70669f777ecca1fd4b,5b572f74669f777ecca1fd51," +
                                         "5b572f74669f777ecca1fd52,5b572f7e669f777ecca1fd63,5b572f83669f777ecca1fd6a," +
                                         "5b572f84669f777ecca1fd6b,5b572f85669f777ecca1fd6d,5b572f85669f777ecca1fd6e," +
                                         "5b572f88669f777ecca1fd73,5b572f8c669f777ecca1fd7a," +
                                         "5b572f51669f777ecca1fd0c,5b572f90669f777ecca1fd80,5b572f93669f777ecca1fd84," +
                                         "5b572f97669f777ecca1fd8a,5b572f9d669f777ecca1fd94,5b572f9e669f777ecca1fd95";

        public static string[] SubSaharanAfricaAsArray => SubSaharanAfrica.Split(',');

        public static string NorthAfrica => "5b572f2e669f777ecca1fcd7,5b572f4e669f777ecca1fd05,5b572f61669f777ecca1fd33," +
                                            "5b572f94669f777ecca1fd86";

        public static string Africa => $"{NorthAfrica},{SubSaharanAfrica}";
        public static string[] AfricaAsArray => Africa.Split(',');

        public static string SADC => "5b572f32669f777ecca1fcd9,5b572f3d669f777ecca1fce9,5b572f51669f777ecca1fd0c," +
                                     "5b572f60669f777ecca1fd31,5b572f65669f777ecca1fd39,5b572f6b669f777ecca1fd42," +
                                     "5b572f6f669f777ecca1fd49,5b572f70669f777ecca1fd4b,5b572f85669f777ecca1fd6d," +
                                     "5b572f90669f777ecca1fd80,5b572f9d669f777ecca1fd94," +
                                     "5b572f9e669f777ecca1fd95,5b572f47669f777ecca1fcf9";
        public static string[] SADCAsArray => SADC.Split(',');
    }
}
