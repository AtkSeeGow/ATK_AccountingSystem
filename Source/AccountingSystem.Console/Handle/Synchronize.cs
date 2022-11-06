using AccountingSystem.Domain.Interface;
using AccountingSystem.Domain.Options;
using AccountingSystem.Repository;
using NLog;
using System.Linq;

namespace AccountingSystem.Console.Handle
{
    /// <summary>
    /// 
    /// </summary>
    public class Synchronize : IHandle
    {
        private static Logger logger = LogManager.GetCurrentClassLogger();

        public string Command { get; set; }

        private LocalMongoDBOptions localMongoDBOptions { get; set; }
        private RemoteMongoDBOptions remoteMongoDBOptions { get; set; }

        public Synchronize(
            string command,
            LocalMongoDBOptions localMongoDBOptions,
            RemoteMongoDBOptions remoteMongoDBOptions)
        {
            this.Command = command;
            this.localMongoDBOptions = localMongoDBOptions;
            this.remoteMongoDBOptions = remoteMongoDBOptions;
        }

        public void Execution(string[] args)
        {
            logger.Debug($"this.localMongoDBOptions.ConnectionString: {this.localMongoDBOptions.ConnectionString}");
            logger.Debug($"this.remoteMongoDBOptions.ConnectionString: {this.remoteMongoDBOptions.ConnectionString}");

            var localAccountingSubjectRepository = new AccountingSubjectRepository(this.localMongoDBOptions);
            var remoteAccountingSubjectRepository = new AccountingSubjectRepository(this.remoteMongoDBOptions);

            var accountingSubjects = remoteAccountingSubjectRepository.FetchAll().Result;
            logger.Debug($"accountingSubjects.Count(): {accountingSubjects.Count()}");

            localAccountingSubjectRepository.DeleteAll().Wait();
            logger.Debug($"localAccountingSubjectRepository.DeleteAll().Wait();");

            localAccountingSubjectRepository.CreateAll(accountingSubjects).Wait();
            logger.Debug($"localAccountingSubjectRepository.CreateAll(accountingSubjects).Wait();");

            var localAuthorizationRepository = new AuthorizationRepository(this.localMongoDBOptions);
            var remoteAuthorizationRepository = new AuthorizationRepository(this.remoteMongoDBOptions);

            var authorizations = remoteAuthorizationRepository.FetchAll().Result;
            logger.Debug($"authorizations.Count(): {authorizations.Count()}");

            localAuthorizationRepository.DeleteAll().Wait();
            logger.Debug($"localAuthorizationRepository.DeleteAll().Wait();");

            localAuthorizationRepository.CreateAll(authorizations).Wait();
            logger.Debug($"localAuthorizationRepository.CreateAll(authorizations).Wait();");

            var localBookRepository = new BookRepository(this.localMongoDBOptions);
            var remoteBookRepository = new BookRepository(this.remoteMongoDBOptions);

            var books = remoteBookRepository.FetchAll().Result;
            logger.Debug($"books.Count(): {books.Count()}");

            if (books.Count() > 0)
            {
                localBookRepository.DeleteAll().Wait();
                logger.Debug($"localBookRepository.DeleteAll().Wait();");

                localBookRepository.CreateAll(books).Wait();
                logger.Debug($"localBookRepository.CreateAll(books).Wait();");
            }

            var localDetailRepository = new DetailRepository(this.localMongoDBOptions);
            var remoteDetailRepository = new DetailRepository(this.remoteMongoDBOptions);

            var packageInformationIds = localDetailRepository.GetPackageInformationIds();
            logger.Debug($"packageInformationIds.Count(): {packageInformationIds.Count()}");

            var details = remoteDetailRepository.FetchAll(item => !packageInformationIds.Contains(item.PackageInformation.Id)).Result;
            logger.Debug($"details.Count(): {details.Count()}");

            foreach(var detail in details)
            {
                if (localDetailRepository.Exist(detail.Id))
                    localDetailRepository.Update(detail);
                else
                    localDetailRepository.Create(detail).Wait();
            }
            logger.Debug($"localDetailRepository.CreateAll(details).Wait();");
        }
    }
}
