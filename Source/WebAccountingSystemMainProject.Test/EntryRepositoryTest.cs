using WebAccountingSystemMainProject.Domain.Options;
using WebAccountingSystemMainProject.Repository;
using Xunit;

namespace WebAccountingSystemMainProject.Test
{
    public class EntryRepositoryTest
    {
        private readonly AccountingSubjectRepository accountingSubjectRepository;
        private readonly EntryRepository entryRepository;
        
        private readonly MongoDBOptions mongoDBOptions = new MongoDBOptions()
        {
            ConnectionString = "mongodb://localhost:27017/",
            CollectionName = "ATK_AccountingSystem"
        };

        public EntryRepositoryTest()
        {
            this.accountingSubjectRepository = new AccountingSubjectRepository(this.mongoDBOptions);
            this.entryRepository = new EntryRepository(this.mongoDBOptions, new BookRepository(this.mongoDBOptions));
        }

        [Fact]
        public void UpdateBookNameBy()
        {
            var entrys = this.entryRepository.FetchAll(item => 
            item.EntryAccountingSubject == "110101" && 
            item.EntryBookName != "OTHER" &&
            item.EntryBookName != "OKINAWA" &&
            item.EntryRecorder == "atkseegow").Result;

            foreach (var entry in entrys)
            {
                entry.EntryBookName = "OTHER";
                this.entryRepository.Update(entry);
            }
        }
    }
}