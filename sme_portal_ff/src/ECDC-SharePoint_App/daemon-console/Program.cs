// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

using Microsoft.Graph;
using Microsoft.Identity.Client;
using Microsoft.Identity.Web;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text.Json.Nodes;
using System.Threading.Tasks;

namespace daemon_console
{
    /// <summary>
    /// This sample shows how to query the Microsoft Graph from a daemon application
    /// which uses application permissions.
    /// For more information see https://aka.ms/msal-net-client-credentials
    /// </summary>
    class Program
    {
        static void Main(string[] args)
        {
            try
            {
                RunAsync().GetAwaiter().GetResult();
            }
            catch (Exception ex)
            {
                Console.ForegroundColor = ConsoleColor.Red;
                Console.WriteLine(ex.Message);
                Console.ResetColor();
            }

            Console.WriteLine("Press any key to exit");
            Console.ReadKey();
        }


        private static async Task RunAsync()
        {
            AuthenticationConfig config = AuthenticationConfig.ReadFromJsonFile("appsettings.json");

            // You can run this sample using ClientSecret or Certificate. The code will differ only when instantiating the IConfidentialClientApplication
            bool isUsingClientSecret = IsAppUsingClientSecret(config);

            // Even if this is a console application here, a daemon application is a confidential client application
            IConfidentialClientApplication app;

            if (isUsingClientSecret)
            {
                // Even if this is a console application here, a daemon application is a confidential client application
                app = ConfidentialClientApplicationBuilder.Create(config.ClientId)
                    .WithClientSecret(config.ClientSecret)
                    .WithAuthority(new Uri(config.Authority))
                    .Build();
            }

            else
            {
                ICertificateLoader certificateLoader = new DefaultCertificateLoader();
                certificateLoader.LoadIfNeeded(config.Certificate);

                app = ConfidentialClientApplicationBuilder.Create(config.ClientId)
                    .WithCertificate(config.Certificate.Certificate)
                    .WithAuthority(new Uri(config.Authority))
                    .Build();
            }

            app.AddInMemoryTokenCache();

            // With client credentials flows the scopes is ALWAYS of the shape "resource/.default", as the 
            // application permissions need to be set statically (in the portal or by PowerShell), and then granted by
            // a tenant administrator. 
            string[] scopes = new string[] { $"{config.ApiUrl}.default" }; // Generates a scope -> "https://graph.microsoft.com/.default"

            // Call MS graph using the Graph SDK
            await CallMSGraphUsingGraphSDK(app, scopes);
                        
        }

        /// <summary>
        /// The following example shows how to initialize the MS Graph SDK
        /// </summary>
        /// <param name="app"></param>
        /// <param name="scopes"></param>
        /// <returns></returns>
        private static async Task CallMSGraphUsingGraphSDK(IConfidentialClientApplication app, string[] scopes)
        {
            // Prepare an authenticated MS Graph SDK client
            GraphServiceClient graphServiceClient = GetAuthenticatedGraphClient(app, scopes);

            string filePath = @"C:\Users\Mfundo\Documents\Custom Office Templates\sp_App_Presentation.pptx";
            // Get the file name from the file path
            string fileName = Path.GetFileName(filePath);
            string siteUrl = "https://ecdccoza.sharepoint.com";

            List<User> allUsers = new List<User>();

            try
            {
                var sharepointDomain = "ecdccoza.sharepoint.com";
                var relativePath = "/sites/ECDCDocuments";
                var folderToUse = "TestDocs";

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

                // folder to upload to
                var folder = items
                    .FirstOrDefault(f => f.Folder != null && f.WebUrl.Contains(folderToUse));

                // Upload file
                string path = filePath;
                byte[] data = System.IO.File.ReadAllBytes(path);
                Stream stream = new MemoryStream(data);
                await graphServiceClient.Sites[site.Id]
                        .Drives[drive.Id]
                        .Items[folder.Id]
                        .ItemWithPath(fileName)
                        .Content
                        .Request()
                        .PutAsync<DriveItem>(stream);


                string fileNames = string.Empty;
                var files = await graphServiceClient
                    .Sites[site.Id]
                    .Drives[drive.Id]
                    .Items[folder.Id]
                    .Children
                    .Request().GetAsync();

                //foreach (var file in files)
                //{
                //    fileNames = $"{fileNames} {file.Name}";
                //}

                Console.ForegroundColor = ConsoleColor.Green;
                Console.WriteLine($"File uploaded: {fileName}");
                Console.ResetColor();

            }
            catch (ServiceException e)
            {
                Console.WriteLine("We could not retrieve the user's list: " + $"{e}");
            }

        }

  
        /// <summary>
        /// An example of how to authenticate the Microsoft Graph SDK using the MSAL library
        /// </summary>
        /// <returns></returns>
        private static GraphServiceClient GetAuthenticatedGraphClient(IConfidentialClientApplication app, string[] scopes)
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
        /// Display the result of the Web API call
        /// </summary>
        /// <param name="result">Object to display</param>
        private static void Display(JsonNode result)
        {
            JsonArray nodes = ((result as JsonObject).ToArray()[1]).Value as JsonArray;

            foreach (JsonObject aNode in nodes.ToArray())
            {
                foreach(var property in aNode.ToArray())
                {
                    Console.WriteLine($"{property.Key} = {property.Value?.ToString()}");
                }
                Console.WriteLine();
            }
        }

        /// <summary>
        /// Checks if the sample is configured for using ClientSecret or Certificate. This method is just for the sake of this sample.
        /// You won't need this verification in your production application since you will be authenticating in AAD using one mechanism only.
        /// </summary>
        /// <param name="config">Configuration from appsettings.json</param>
        /// <returns></returns>
        private static bool IsAppUsingClientSecret(AuthenticationConfig config)
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
