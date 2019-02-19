using WebAccountingSystemMainProject.Domain;
using WebAccountingSystemMainProject.Domain.Options;
using WebAccountingSystemMainProject.Repository;
using Xunit;

namespace WebAccountingSystemMainProject.Test
{
    public class AccountingSubjectRepositoryTest
    {
        private readonly AccountingSubjectRepository accountingSubjectRepository;

        private readonly MongoDBOptions mongoDBOptions = new MongoDBOptions()
        {
            ConnectionString = "mongodb://Ubuntu-1804.mshome.net:27017/",
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
                AccountingSubjectType = Domain.Enum.AccountingSubjectType.Assets,
                AccountingSubjectCode = "1101",
                AccountingSubjectName = "現金",
                AccountingSubjectDescription = "凡庫存現金、銀行存款、匯撥中現金、零用金及週轉金、庫存外幣等屬之，但不包括已指定用途，或有法律、契約上之限制者。",
            };
            this.accountingSubjectRepository.Create(accountingSubject).Wait();
        }
    }
}
