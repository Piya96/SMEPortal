using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace SME.Portal.Helpers
{
    public class ImageUrlHelper
    {
        public static string GetImageUrl(string imageName, string size = null)
        {
            if (string.IsNullOrEmpty(imageName)) return string.Empty;

            if (!string.IsNullOrEmpty(size))
            {
                var fileExt = Path.GetExtension(imageName);
                var fileName = Path.GetFileNameWithoutExtension(imageName);

                imageName = $"{fileName}-{size}{fileExt}";
            }

            // return $"https://via.placeholder.com/150/0000FF/808080 ?Text=PAKAINFO.com";
            return $"https://ffservices.blob.core.windows.net/lender-logos/{imageName}";
        }
    }
}
