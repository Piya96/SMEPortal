﻿using System.Drawing;
using System.Drawing.Imaging;
using System.IO;

namespace SME.Portal.Web.Helpers
{
    public class ImageFormatHelper
    {
        public static ImageFormat GetRawImageFormat(byte[] fileBytes)
        {
            using (var ms = new MemoryStream(fileBytes))
            {
                var fileImage = Image.FromStream(ms);
                return fileImage.RawFormat;
            }
        }
    }
}
