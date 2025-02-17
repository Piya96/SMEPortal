using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Blob;
using Microsoft.WindowsAzure.Storage.Queue;
using Microsoft.WindowsAzure.Storage.Table;
using System;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace SME.Portal.Helpers
{
    public static class AzureStorageHelpers
    {
        public static void ValidateAzureStorageConnectionString(string connectionStr)
        {
            if (string.IsNullOrEmpty(connectionStr))
                throw new ArgumentNullException("connectionStr", "Azure Storage Connection string cannot be null or empty");
        }

        /// <summary>
        /// Uploads a file to blob storage
        /// </summary>
        /// <param name="connectionString">Azure Storage Account connection string</param>
        /// <param name="fileStream">Stream for the file to upload</param>
        /// <param name="fileName">String denoting the file name</param>
        /// <param name="contentType">String denoting the content type eg: 'image/jpg' </param>
        /// <param name="containerName">String denoting the container to place the file into.</param>
        /// <returns></returns>
        public static async Task<Uri> UploadFileToStorage(string connectionString, Stream fileStream, string fileName, string containerName, string contentType)
        {
            Validate(connectionString, fileName, contentType, containerName);

            CloudStorageAccount storageAccount = CloudStorageAccount.Parse(connectionString);
            CloudBlobClient client = storageAccount.CreateCloudBlobClient();

            // Get reference to the blob container by passing the name 
            var container = client.GetContainerReference(containerName);

            // Create the container if it doesn't already exist.
            await container.CreateIfNotExistsAsync();

            // Get the reference to the block blob from the container
            var blockBlob = container.GetBlockBlobReference(fileName);

            await blockBlob.UploadFromStreamAsync(fileStream).ConfigureAwait(false);

            blockBlob.Properties.ContentType = contentType;
            await blockBlob.SetPropertiesAsync();

            return blockBlob.Uri;
        }

        /// <summary>
        /// Uploads a file to blob storage
        /// </summary>
        /// <param name="connectionString">String</param>
        /// <param name="fileStream">byte array</param>
        /// <param name="fileName">String</param>
        /// <param name="containerName">String</param>
        /// <param name="contentType">String</param>
        /// <returns>string</returns>
        public static async Task<Uri> UploadFileToStorage(string connectionString, byte[] fileStream, string fileName, string containerName, string contentType = "image/jpg")
        {
            Validate(connectionString, fileName, contentType, containerName);

            CloudStorageAccount storageAccount = CloudStorageAccount.Parse(connectionString);
            CloudBlobClient client = storageAccount.CreateCloudBlobClient();

            // Get reference to the blob container by passing the name 
            var container = client.GetContainerReference(containerName);

            // Create the container if it doesn't already exist.
            await container.CreateIfNotExistsAsync();

            // Get the reference to the block blob from the container
            var blockBlob = container.GetBlockBlobReference(fileName);

            // Upload the file
            await blockBlob.UploadFromByteArrayAsync(fileStream, 0, fileStream.Length);

            blockBlob.Properties.ContentType = contentType;
            await blockBlob.SetPropertiesAsync();

            return blockBlob.Uri;
        }

        private static void Validate(string connectionString, string fileName, string contentType, string containerName)
        {
            ValidateAzureStorageConnectionString(connectionString);

            if (string.IsNullOrEmpty(fileName))
                throw new ArgumentException("File name cannot be null or empty string", "fileName");

            if (string.IsNullOrEmpty(contentType))
                throw new ArgumentException("Content type cannot be null or empty string", "contentType");

            if (string.IsNullOrEmpty(containerName))
                throw new ArgumentException("Azure Storage Container name cannot be null or empty string", "containerName");

            // validate the container name
            var matchCollection = Regex.Matches(containerName, @"^[a-z0-9](?!.*--)[a-z0-9-]{1,61}[a-z0-9]$", RegexOptions.Singleline);
            var list = matchCollection.Cast<Match>().Select(match => match.Value).ToList();

            if (!list.Any())
                throw new SystemException("Container name is not of a valid format");

            return;
        }

        /// <summary>
        /// Sends a message to a CloudQueue
        /// </summary>
        /// <param name="theQueue"></param>
        /// <param name="newMessage"></param>
        /// <returns></returns>
        public static async Task SendMessageAsync(string connectionString, string queueName, string message)
        {
            if (string.IsNullOrEmpty(connectionString))
                throw new ArgumentNullException("connectionString", "An empty connectionString cannot be used to send a message to a Queue");

            if (string.IsNullOrEmpty(queueName))
                throw new ArgumentNullException("queueName", "An empty queue name cannot be used to send a message to a Queue");

            if (string.IsNullOrEmpty(message))
                throw new ArgumentNullException("message", "An empty message cannot be sent to a queue");

            // Retrieve storage account from connection string.
            CloudStorageAccount storageAccount = CloudStorageAccount.Parse(connectionString);

            // Create the queue client.
            CloudQueueClient queueClient = storageAccount.CreateCloudQueueClient();

            // Retrieve a reference to a container.
            CloudQueue queue = queueClient.GetQueueReference(queueName);

            // Create the queue if it doesn't already exist
            bool isQueueCreated = await queue.CreateIfNotExistsAsync();

            if (isQueueCreated)
                Console.WriteLine("The queue was created.");

            await queue.AddMessageAsync(new CloudQueueMessage(message));
        }

        /// <summary>
        /// Creates a CloudTable given a connection string and table name
        /// </summary>
        /// <param name="connection">string connection</param>
        /// <param name="tableName">string table name</param>
        /// <returns>CloudTable object</returns>
        public static async Task<CloudTable> CreateTableIfNotExists(string connection, string tableName)
        {
            ValidateAzureStorageConnectionString(connection);

            if (string.IsNullOrEmpty(tableName))
                throw new ArgumentNullException("tableName", "Azure Storage Table name cannot be empty or null string");

            // setup storage table
            var storageAccount = CloudStorageAccount.Parse(connection);
            var tableClient = storageAccount.CreateCloudTableClient();
            var table = tableClient.GetTableReference(tableName);
            await table.CreateIfNotExistsAsync();

            return table;
        }
    }
}
