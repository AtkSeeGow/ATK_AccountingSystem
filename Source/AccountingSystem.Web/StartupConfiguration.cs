using AccountingSystem.Domain.Options;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using TokenOptions = AccountingSystem.Domain.Options.TokenOptions;

namespace AccountingSystem.Web
{
    public class StartupConfiguration
    {
        public static void ConfigureServices(IServiceCollection services, IConfiguration configuration)
        {
            var authorizationOptions = configuration.GetSection("AuthorizationOptions").Get<AuthorizationOptions>();
            var tokenOptions = configuration.GetSection("TokenOptions").Get<TokenOptions>();
            var mongoDBOptions = configuration.GetSection("MongoDBOptions").Get<MongoDBOptions>();

            services.AddSingleton(provider => authorizationOptions);
            services.AddSingleton(provider => tokenOptions);
            services.AddSingleton(provider => mongoDBOptions);
        }
    }
}
