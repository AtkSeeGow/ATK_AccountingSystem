using AccountingSystem.Console.Handle;
using AccountingSystem.Domain.Interface;
using AccountingSystem.Domain.Options;
using Microsoft.Extensions.DependencyInjection;

namespace AccountingSystem.Console.Startup
{
    /// <summary>
    /// 
    /// </summary>
    public class StartupHandle
    {
        /// <summary>
        /// 
        /// </summary>
        /// <param name="serviceCollection"></param>
        public static void ConfigureServices(ServiceCollection serviceCollection)
        {
            serviceCollection.AddTransient<IHandle>(i =>
            new Synchronize(
                "Synchronize",
                serviceCollection.BuildServiceProvider().GetService<LocalMongoDBOptions>(),
                serviceCollection.BuildServiceProvider().GetService<RemoteMongoDBOptions>()));
        }
    }
}
