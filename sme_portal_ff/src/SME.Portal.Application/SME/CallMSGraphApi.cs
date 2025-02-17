using Microsoft.Identity.Client;
using Microsoft.Identity.Web;
using System;
using System.Collections.Generic;
using System.Text;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Graph;
using System.IO;
using System.Net.Http.Headers;
using Abp.Runtime.Session;
//using Abp.AspNetCore.Mvc.Authorization;

using Abp.BackgroundJobs;
using Abp.Domain.Repositories;
using Abp.Domain.Uow;
using Abp.Runtime.Session;
using SME.Portal.Authorization.Users;
using SME.Portal.Company;
using SME.Portal.HubSpot;
using SME.Portal.HubSpot.Dtos;
using SME.Portal.Lenders;
using SME.Portal.Lenders.Dtos;
using SME.Portal.SME.Dtos;
using SME.Portal.SME.Exporting;
using System.Net;

using SME.Portal.Common.Dtos;
using SME.Portal.FinanceProductActions.Dtos;

using SME.Portal.Common.Dto;
using Abp.Authorization;
using Abp.Application.Services.Dto;
using Microsoft.EntityFrameworkCore;
using SME.Portal.List;
using Abp.MultiTenancy;
using SME.Portal.sefaLAS;
using Newtonsoft.Json;
using SME.Portal.PropertiesJson;
using SME.Portal.Company.Dtos;
using Newtonsoft.Json.Linq;
using SME.Portal.Url;
using Abp.Authorization;
using Abp.Configuration;
using Abp.Extensions;
using Abp.Runtime.Security;
using Abp.Runtime.Session;
using Abp.UI;
using Abp.Zero.Configuration;
using Abp.Domain.Repositories;
using Abp.BackgroundJobs;
using Abp.Authorization.Users;
using SME.Portal.Qlana;
using Abp;
using SME.Portal.MultiTenancy;
using SME.Portal.Sessions;
using SME.Portal.Authorization.Users.Profile;
using Microsoft.AspNetCore.Identity;
using NPOI.SS.Formula.Functions;
using SME.Portal.Documents.Dtos;
using Microsoft.Extensions.Configuration;
using SME.Portal.Configuration;
using System.Globalization;

namespace SME.Portal.SME
{
    public class CallMSGraphApi 
    {

        private readonly IAbpSession _abpSession;
        private readonly UserManager _userManager;
        private readonly IConfigurationRoot _appConfiguration;

        public CallMSGraphApi(IAbpSession abpSession, UserManager userManager, IAppConfigurationAccessor configurationAccessor)
        {
            _abpSession = abpSession;
            _userManager = userManager;
            _appConfiguration = configurationAccessor.Configuration;
        }

        public CallMSGraphApi()
        {
            
        }
        public async Task RunAsync(byte[] bytes, List<Tuple<byte[], string>> getAllAttachedDocuments, int applicationId)
        {
            //AuthenticationConfig config = AuthenticationConfig.ReadFromJsonFile("SharePointAPIsettings.json");
            //bool isUsingClientSecret = IsAppUsingClientSecret(config);

            IConfidentialClientApplication app;

            app = ConfidentialClientApplicationBuilder.Create(GetFromSettings("SharepointConfig:ClientId"))
                .WithClientSecret(GetFromSettings("SharepointConfig:ClientSecret"))
                .WithAuthority(new Uri(String.Format(CultureInfo.InvariantCulture, GetFromSettings("SharepointConfig:Instance"), GetFromSettings("SharepointConfig:Tenant"))))
                .Build();

            // Leaving this code in incase we want to switch to using certificates
            //if (isUsingClientSecret)
            //{
            //    // Even if this is a console application here, a daemon application is a confidential client application
            //    app = ConfidentialClientApplicationBuilder.Create(GetFromSettings("SharepointConfig:ClientId"))
            //        .WithClientSecret(GetFromSettings("SharepointConfig:ClientSecret"))
            //        .WithAuthority(new Uri(String.Format(CultureInfo.InvariantCulture, GetFromSettings("SharepointConfig:Instance"), GetFromSettings("SharepointConfig:Tenant"))))
            //        .Build();
            //}
            //else
            //{
            //    ICertificateLoader certificateLoader = new DefaultCertificateLoader();
            //    certificateLoader.LoadIfNeeded(config.Certificate);
            //    //certificateLoader.LoadIfNeeded(GetFromSettings("SharepointConfig:ClientSecret"));
                

            //    app = ConfidentialClientApplicationBuilder.Create(GetFromSettings("SharepointConfig:ClientId"))
            //        //.WithCertificate(GetFromSettings("SharepointConfig:ClientSecret"))
            //        .WithAuthority(new Uri(String.Format(CultureInfo.InvariantCulture, GetFromSettings("SharepointConfig:Instance"), GetFromSettings("SharepointConfig:Tenant"))))
            //        .Build();
            //}

            app.AddInMemoryTokenCache();

            // With client credentials flows the scopes is ALWAYS of the shape "resource/.default", as the 
            // application permissions need to be set statically (in the portal or by PowerShell), and then granted by
            // a tenant administrator. 
            string[] scopes = new string[] { $"{GetFromSettings("SharepointConfig:ApiUrl")}.default" }; // Generates a scope -> "https://graph.microsoft.com/.default"

            // Call MS graph using the Graph SDK
            await CallMSGraphUsingGraphSDK(app, scopes, bytes, getAllAttachedDocuments, applicationId);

        }

        private string GetFromSettings(string name, string defaultValue = null)
        {
            return _appConfiguration[name] ?? defaultValue;
        }

        public async Task<string> GetUserName()
        {
            var user = await _userManager.GetUserAsync(_abpSession.ToUserIdentifier()); // get current user

            return user.FullName;
        }

        private readonly ApplicationAppServiceExt _applicationsAppServiceExt;

        /// <summary>
        /// The following example shows how to initialize the MS Graph SDK
        /// </summary>
        /// <param name="app"></param>
        /// <param name="scopes"></param>
        /// <returns></returns>
        public async Task CallMSGraphUsingGraphSDK(IConfidentialClientApplication app, string[] scopes, byte[] bytes, List<Tuple<byte[], string>> getAllAttachedDocuments, int applicationId)
        {
            // Prepare an authenticated MS Graph SDK client
            GraphServiceClient graphServiceClient = GetAuthenticatedGraphClient(app, scopes);

            try
            {
                var sharepointDomain = "ecdccoza.sharepoint.com";
                var relativePath = "/sites/ECDCDocuments";
                //var folderToUse = "TestDocs";

                //var userFullName = await GetUserName();

                var site = await graphServiceClient
                    .Sites[sharepointDomain]
                    .SiteWithPath(relativePath)
                    .Request()
                    .GetAsync();

                var drive = await graphServiceClient
                    .Sites[site.Id]
                    .Drive
                    .Request()
                    .GetAsync();

                var items = await graphServiceClient
                    .Sites[site.Id]
                    .Drives[drive.Id]
                    .Root
                    .Children
                    .Request().GetAsync();


                var applicationID = items.FirstOrDefault(f => f.Folder != null && f.Name == applicationId.ToString());

                //var folderSearch = items.FirstOrDefault(f => f.Folder != null && f.Name == userFullName);

                if (applicationID != null)
                {
                    // Upload file to the existing folder
                    foreach (var oldUserBytes in getAllAttachedDocuments)
                    {
                        //list of finance application docs to upload.
                        Stream streamFiles = new MemoryStream(oldUserBytes.Item1);
                        await graphServiceClient.Sites[site.Id]
                            .Drives[drive.Id]
                            .Items[applicationID.Id]
                            .ItemWithPath(oldUserBytes.Item2)
                            .Content
                            .Request()
                            .PutAsync<DriveItem>(streamFiles);
                    }

                    // normal bytes to upload("Finance Application Summary.pdf")
                    Stream streamSingle = new MemoryStream(bytes);
                    await graphServiceClient.Sites[site.Id]
                        .Drives[drive.Id]
                        .Items[applicationID.Id]
                        .ItemWithPath("Application Summary Finance.pdf")
                        .Content
                        .Request()
                        .PutAsync<DriveItem>(streamSingle);
                }
                else
                {
                    // Create a new folder with the unique name
                    DriveItem newFolder = new DriveItem
                    {
                        Name = applicationId.ToString(),
                        Folder = new Folder(),
                        AdditionalData = new Dictionary<string, object>()
                        {
                            { "@microsoft.graph.conflictBehavior", "rename" }
                        }
                    };
                    newFolder = await graphServiceClient.Sites[site.Id]
                        .Drives[drive.Id]
                        .Root
                        .Children
                        .Request()
                        .AddAsync(newFolder);

                    // Upload file to the new folder
                    foreach (var newUserBytes in getAllAttachedDocuments)
                    {
                        Stream streamNewFiles = new MemoryStream(newUserBytes.Item1);
                        await graphServiceClient.Sites[site.Id]
                            .Drives[drive.Id]
                            .Items[newFolder.Id]
                            .ItemWithPath(newUserBytes.Item2)
                            .Content
                            .Request()
                            .PutAsync<DriveItem>(streamNewFiles);
                    }

                    // normal bytes to upload("Finance Application Summary.pdf")
                    Stream streamNewSingle = new MemoryStream(bytes);
                    await graphServiceClient.Sites[site.Id]
                        .Drives[drive.Id]
                        .Items[newFolder.Id]
                        .ItemWithPath("Application Summary Finance.pdf")
                        .Content
                        .Request()
                        .PutAsync<DriveItem>(streamNewSingle);

                }

            }
            catch (ServiceException e)
            {

            }

        }


        /// <summary>
        /// An example of how to authenticate the Microsoft Graph SDK using the MSAL library
        /// </summary>
        /// <returns></returns>
        public GraphServiceClient GetAuthenticatedGraphClient(IConfidentialClientApplication app, string[] scopes)
        {

            GraphServiceClient graphServiceClient =
                    new GraphServiceClient("https://graph.microsoft.com/V1.0/", new DelegateAuthenticationProvider(async (requestMessage) =>
                    {
                        // Retrieve an access token for Microsoft Graph (gets a fresh token if needed).
                        AuthenticationResult result = await app.AcquireTokenForClient(scopes)
                            .ExecuteAsync();

                        // Add the access token in the Authorization header of the API request.
                        requestMessage.Headers.Authorization =
                            new AuthenticationHeaderValue("Bearer", result.AccessToken);
                    }));

            return graphServiceClient;
        }

        /// <summary>
        /// Checks if the sample is configured for using ClientSecret or Certificate. This method is just for the sake of this sample.
        /// You won't need this verification in your production application since you will be authenticating in AAD using one mechanism only.
        /// </summary>
        /// <param name="config">Configuration from appsettings.json</param>
        /// <returns></returns>
        public bool IsAppUsingClientSecret(AuthenticationConfig config)
        {
            string clientSecretPlaceholderValue = "[Enter here a client secret for your application]";

            if (!String.IsNullOrWhiteSpace(config.ClientSecret) && config.ClientSecret != clientSecretPlaceholderValue)
            {
                return true;
            }

            else if (config.Certificate != null)
            {
                return false;
            }

            else
                throw new Exception("You must choose between using client secret or certificate. Please update appsettings.json file.");
        }
    }
}
