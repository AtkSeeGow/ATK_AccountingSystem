using AccountingSystem.Domain;
using AccountingSystem.Domain.Options;
using AccountingSystem.Repository;
using Xunit;

namespace AccountingSystem.Test
{
    public class AccountingSubjectRepositoryTest
    {
        private readonly AccountingSubjectRepository accountingSubjectRepository;

        private readonly MongoDBOptions mongoDBOptions = new MongoDBOptions()
        {
            ConnectionString = "mongodb://localhost:27017/",
            CollectionName = "ATK_AccountingSystem"
        };

        public AccountingSubjectRepositoryTest()
        {
            this.accountingSubjectRepository = new AccountingSubjectRepository(this.mongoDBOptions);
        }

        [Fact]
        public void Create()
        {
            var accountingSubject = new AccountingSubject()
            {
                Type = Domain.Enum.AccountingSubjectType.Assets,
                Code = "1101",
                Name = "�{��",
                Description = "�Z�w�s�{���B�Ȧ�s�ڡB�׼����{���B�s�Ϊ��ζg����B�w�s�~�����ݤ��A�����]�A�w���w�γ~�A�Φ��k�ߡB�����W������̡C",
            };
            this.accountingSubjectRepository.Create(accountingSubject).Wait();
        }
    }
}
