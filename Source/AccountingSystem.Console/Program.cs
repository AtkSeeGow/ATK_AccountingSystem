using AccountingSystem.Console.Startup;
using AccountingSystem.Domain.Interface;
using Microsoft.Extensions.DependencyInjection;
using MongoDB.Bson;
using MongoDB.Bson.Serialization;
using MongoDB.Bson.Serialization.Serializers;
using NLog;
using System;
using System.Linq;

namespace AccountingSystem.Console
{
    internal class Program
    {
        private static Logger logger = LogManager.GetCurrentClassLogger();

        static void Main(string[] args)
        {
            BsonSerializer.RegisterSerializer(typeof(DateTime), new DateTimeSerializer(DateTimeKind.Local, BsonType.DateTime));

            var serviceCollection = new ServiceCollection();
            StartupConfiguration.ConfigureServices(serviceCollection);
            StartupHandle.ConfigureServices(serviceCollection);

            try
            {
                var command = args[0];
                if (string.IsNullOrEmpty(command))
                    return;

                logger.Debug($"Program runing start args[0]:{command}");

                var handle = serviceCollection.BuildServiceProvider().GetServices<IHandle>().Where(item => item.Command == command).FirstOrDefault();
                handle.Execution(args);

                logger.Debug("Program runing completed...");
            }
            catch (Exception exception)
            {
                logger.Error(exception);
                throw exception;
            }
        }
    }
}
