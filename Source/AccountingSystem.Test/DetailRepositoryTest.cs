using System;
using System.Globalization;
using AccountingSystem.Domain;
using AccountingSystem.Domain.Enum;
using AccountingSystem.Domain.Options;
using AccountingSystem.Repository;
using Xunit;

namespace AccountingSystem.Test
{
    public class DetailRepositoryTest
    {
        private readonly AccountingSubjectRepository accountingSubjectRepository;
        private readonly DetailRepository detailRepository;

        private readonly MongoDBOptions mongoDBOptions = new MongoDBOptions()
        {
            ConnectionString = "mongodb://localhost:27017/",
            CollectionName = "ATK_AccountingSystem"
        };

        public DetailRepositoryTest()
        {
            this.accountingSubjectRepository = new AccountingSubjectRepository(this.mongoDBOptions);
            this.detailRepository = new DetailRepository(this.mongoDBOptions);
        }

        [Fact]
        public void Create()
        {
            var detail = new Detail()
            {
                Name = "Test",
                Recorder = "atkseegow",
                TradingDay = DateTime.Now
            };

            detail.Entrys.Add(new Entry() { AccountingSubjectCode = "BBB", Amount = 1111, Summary = "BBB", Type = EntryType.Credits });
            detail.Entrys.Add(new Entry() { AccountingSubjectCode = "BBB", Amount = 1111, Summary = "BB", Type = EntryType.Debits });

            this.detailRepository.Create(detail).Wait();
        }

        [Fact]
        public void LedgerBy()
        {
            this.detailRepository.GroupBy(DateTime.Now, DateTime.Now);
        }

        [Fact]
        public void FetchAll()
        {
            var details = this.detailRepository.FetchAll().Result;
        }
    }
}