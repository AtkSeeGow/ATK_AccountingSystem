using System;
using System.Globalization;
using AccountingSystem.Domain;
using AccountingSystem.Domain.Enum;
using AccountingSystem.Domain.Options;
using AccountingSystem.Repository;
using Xunit;

namespace AccountingSystem.Test
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
    }
}