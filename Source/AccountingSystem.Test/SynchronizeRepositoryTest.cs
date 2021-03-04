using AccountingSystem.Domain.Options;
using AccountingSystem.Repository;
using Xunit;

namespace AccountingSystem.Test
{
    public class SynchronizeRepositoryTest
    {
        private readonly MongoDBOptions targetMongoDBOptions = new MongoDBOptions()
        {
            ConnectionString = "mongodb://localhost:27017/",
            CollectionName = "ATK_AccountingSystem"
        };

        private readonly MongoDBOptions sourceMongoDBOptions = new MongoDBOptions()
        {
            ConnectionString = "mongodb://192.168.132.129:27017/",
            CollectionName = "ATK_AccountingSystem"
        };

        public SynchronizeRepositoryTest()
        {
        }

        [Fact]
        public void Execute()
        {
            var sourceAccountingSubjectRepository = new AccountingSubjectRepository(this.sourceMongoDBOptions);
            var targetAccountingSubjectRepository = new AccountingSubjectRepository(this.targetMongoDBOptions);
            var accountingSubjects = sourceAccountingSubjectRepository.FetchAll().Result;
            targetAccountingSubjectRepository.CreateAll(accountingSubjects).Wait();

            var sourceDetailRepository = new DetailRepository(this.sourceMongoDBOptions);
            var targetDetailRepository = new DetailRepository(this.targetMongoDBOptions);
            var details = sourceDetailRepository.FetchAll().Result;
            targetDetailRepository.CreateAll(details).Wait();

        }
    }
}