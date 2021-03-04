using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using NLog.Web;
using System.Net;

namespace AccountingSystem.Web
{
    public class Program
    {
        public static void Main(string[] args)
        {
            NLogBuilder.ConfigureNLog("NLog.config").GetCurrentClassLogger();
            CreateWebHostBuilder(args).Build().Run();
        }

        public static IWebHostBuilder CreateWebHostBuilder(string[] args) =>
            WebHost.CreateDefaultBuilder(args)
            .UseNLog()
            .UseKestrel(options =>
            {
                options.Listen(IPAddress.Any, 5000);
                options.Listen(IPAddress.Any, 5001, listenOptions =>
                {
                    listenOptions.UseHttps(@"/certificate/certificate.pfx", "000000");
                });
            })
            .UseStartup<Startup>();
    }
}
