using AccountingSystem.Domain.Options;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.IO;
using System.Text;

namespace AccountingSystem.Console.Startup
{
    /// <summary>
    /// 
    /// </summary>
    public class StartupConfiguration
    {
        /// <summary>
        /// 
        /// </summary>
        /// <param name="serviceCollection"></param>
        public static void ConfigureServices(ServiceCollection serviceCollection)
        {
            Encoding.RegisterProvider(CodePagesEncodingProvider.Instance);

            var builder = new ConfigurationBuilder()
               .SetBasePath(Directory.GetCurrentDirectory())
               .AddJsonFile(Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "appsettings.json"), optional: true, reloadOnChange: true);

            IConfigurationRoot configuration = builder.Build();

            var localMongoDBOptions = new LocalMongoDBOptions();
            configuration.GetSection("LocalMongoDBOptions").Bind(localMongoDBOptions);
            serviceCollection.AddTransient<LocalMongoDBOptions>(i => localMongoDBOptions);

            var remoteMongoDBOptions = new RemoteMongoDBOptions();
            configuration.GetSection("RemoteMongoDBOptions").Bind(remoteMongoDBOptions);
            serviceCollection.AddTransient<RemoteMongoDBOptions>(i => remoteMongoDBOptions);
        }
    }
}
