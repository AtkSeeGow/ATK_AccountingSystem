using AccountingSystem.Repository;
using AccountingSystem.Service;
using AccountingSystem.Web.Handler;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using MongoDB.Bson;
using MongoDB.Bson.Serialization;
using MongoDB.Bson.Serialization.Serializers;
using Newtonsoft.Json.Serialization;
using System;

namespace AccountingSystem.Web
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        public void ConfigureServices(IServiceCollection services)
        {
            BsonSerializer.RegisterSerializer(typeof(DateTime), new DateTimeSerializer(DateTimeKind.Local, BsonType.DateTime));

            StartupConfiguration.ConfigureServices(services, Configuration);

            #region Repository

            services.AddScoped<AccountingSubjectRepository>();
            services.AddScoped<AuthorizationRepository>();
            services.AddScoped<BookRepository>();
            services.AddScoped<DetailRepository>();

            #endregion

            #region Service

            services.AddScoped<AuthorizationService>();

            #endregion

            services.AddControllersWithViews();

            services
                .AddMvc()
                .AddNewtonsoftJson(options => options.SerializerSettings.ContractResolver = new CamelCasePropertyNamesContractResolver())
                .AddJsonOptions(options => options.JsonSerializerOptions.PropertyNameCaseInsensitive = true)
                .SetCompatibilityVersion(CompatibilityVersion.Version_3_0);

            services.AddAuthorization(options =>
            {
                options.AddPolicy("permissionRequirement", policy => policy.Requirements.Add(new PermissionRequirement()));
            }).AddAuthorizationPolicyEvaluator();
            services.AddScoped<IAuthorizationHandler, PermissionRequirementHandler>();

            services.AddAuthentication(options => options.AddScheme("PermissionHandler", o => o.HandlerType = typeof(PermissionHandler)));

            services.AddHttpClient();
            services.AddHttpClient("Heartbeat", client =>
            {
                client.Timeout = TimeSpan.FromSeconds(3);
            });
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            app.Use(async (context, next) =>
            {
                await next.Invoke();

                if (context.Response.StatusCode == 404)
                {
                    context.Request.Path = new PathString("/");
                    await next.Invoke();
                }
            });

            app.UseStaticFiles();

            app.UseRouting();

            app.UseAuthentication();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute(
                   name: "default",
                   pattern: "{controller=Home}/{action=Index}/{id?}");
            });
        }
    }
}
