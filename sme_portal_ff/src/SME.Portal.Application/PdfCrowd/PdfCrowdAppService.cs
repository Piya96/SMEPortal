using Abp.Authorization;
using SME.Portal.PdfCrowd.Dtos;
using System;
using System.IO;

namespace SME.Portal.PdfCrowd
{
    [AbpAuthorize]
    public class PdfCrowdAppService : PortalAppServiceBase
    {
        private readonly pdfcrowd.HtmlToPdfClient _pdfCrowdClient;

        public PdfCrowdAppService()
        {
            // create the API client instance
            _pdfCrowdClient = new pdfcrowd.HtmlToPdfClient("FinfindSupport", "33a27bd132c7840311a75c8c4532eb8d");
        }

        public PdfCrowdFileOutput PdfCrowdRenderUrl(string url, string fileName, string pageSize = "A3", string pageHeight = "-1", string orientation = "portrait")
        {
            try
            {
                // configure the page conversion
                if (string.IsNullOrEmpty(pageHeight))
                {
                    _pdfCrowdClient.setPageSize(pageSize);
                    _pdfCrowdClient.setOrientation(orientation);
                }
                else
                {
                    _pdfCrowdClient.setPageHeight(pageHeight);
                }

                // run the conversion and store the result into the "pdfBytes" variable
                byte[] pdfBytes = _pdfCrowdClient.convertUrl(url);

                using MemoryStream memStream = new MemoryStream();
                memStream.Write(pdfBytes, 0, pdfBytes.Length);
                memStream.Position = 0;

                if (string.IsNullOrEmpty(fileName))
                    throw new ArgumentNullException(fileName, "Parameter 'fileName' cannot be null or empty string");

                return new PdfCrowdFileOutput
                {
                    Bytes = pdfBytes,
                    FileName = fileName,
                    ContentType = "application/pdf",
                    CacheControl = "max-age=0",
                    AcceptRanges = "none",
                    ContentDisposition = "attachment; filename*=UTF-8''" + Uri.EscapeUriString($"{fileName}.pdf")
                };

            }
            catch (pdfcrowd.Error why)
            {
                Logger.Error($"PdfCrowdRenderUrl failed with code:{why.getCode()}; message:{why.getMessage()}; base exception:{why.GetBaseException()}");

                throw;
            }
        }
        
        public PdfCrowdFileOutput PdfCrowdRenderHtml(string html, string fileName, string pageSize = "A3", string pageHeight = "-1", string orientation = "portrait")
        {
            try
            {
                // configure the page conversion
                if (string.IsNullOrEmpty(pageHeight))
                {
                    _pdfCrowdClient.setPageSize(pageSize);
                    _pdfCrowdClient.setOrientation(orientation);
                }
                else
                {
                    _pdfCrowdClient.setPageHeight(pageHeight);
                }

                // run the conversion and store the result into the "pdfBytes" variable
                byte[] pdfBytes = _pdfCrowdClient.convertString(html);

                using MemoryStream memStream = new MemoryStream();
                memStream.Write(pdfBytes, 0, pdfBytes.Length);
                memStream.Position = 0;

				if (string.IsNullOrEmpty(fileName))
                    throw new ArgumentNullException(fileName, "Parameter 'fileName' cannot be null or empty string");

                return new PdfCrowdFileOutput
                {
                    Bytes = pdfBytes,
                    FileName = fileName,
                    ContentType = "application/pdf",
                    CacheControl = "max-age=0",
                    AcceptRanges = "none",
                    ContentDisposition = "attachment; filename*=UTF-8''" + Uri.EscapeUriString($"{fileName}.pdf")
                };

            }
            catch (pdfcrowd.Error why)
            {
                // report the error
                Logger.Error($"PdfCrowdRenderHtml failed with code:{why.getCode()}; message:{why.getMessage()}; base exception:{why.GetBaseException()}");

                throw;
            }



        }
    }
}
