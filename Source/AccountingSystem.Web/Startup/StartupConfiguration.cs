using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using AccountingSystem.Domain.Options;

using TokenOptions = AccountingSystem.Domain.Options.TokenOptions;

namespace AccountingSystem.Web
{
    public class StartupConfiguration
    {
        public static void ConfigureServices(IServiceCollection services, IConfiguration Configuration)
        {
            var authorizationOptions = Configuration.GetSection("AuthorizationOptions").Get<AuthorizationOptions>();
            var tokenOptions = Configuration.GetSection("TokenOptions").Get<TokenOptions>();
            var mongoDBOptions = Configuration.GetSection("MongoDBOptions").Get<MongoDBOptions>();

            services.AddSingleton<AuthorizationOptions>(provider => authorizationOptions);
            services.AddSingleton<TokenOptions>(provider => tokenOptions);
            services.AddSingleton<MongoDBOptions>(provider => mongoDBOptions);
        }
    }
}
