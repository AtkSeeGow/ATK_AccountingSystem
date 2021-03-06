using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using MongoDB.Bson;
using MongoDB.Bson.Serialization;
using MongoDB.Bson.Serialization.Serializers;
using System;
using AccountingSystem.Repository;
using AccountingSystem.Service;
using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;

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

            services.AddMemoryCache();
            services.AddDistributedMemoryCache();
            services.AddSession();

            services.AddMvc(config =>
                config.Filters.Add<AuthorizationFilter>()
            ).SetCompatibilityVersion(CompatibilityVersion.Latest);

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
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            app.Use(async (HttpContext context, Func<Task> next) =>
            {
                await next.Invoke();

                if (context.Response.StatusCode == 404)
                {
                    context.Request.Path = new PathString("/");
                    await next.Invoke();
                }
            });

            app.UseHttpsRedirection();
            app.UseStaticFiles();

            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "default",
                    template: "{controller=Home}/{action=Index}/{id?}");
            });
        }
    }
}
