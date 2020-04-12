using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using AccountingSystem.Domain;
using AccountingSystem.Domain.Enum;
using AccountingSystem.Domain.Options;

namespace AccountingSystem.Repository
{
    public class AccountingSubjectRepository : GenericRepository<AccountingSubject, Guid>
    {
        public AccountingSubjectRepository(MongoDBOptions mongoDBOptions) : base(mongoDBOptions)
        {
        }

        public IEnumerable<AccountingSubject> Autocomplete(string query)
        {
            if (string.IsNullOrEmpty(query))
                query = string.Empty;

            var builder = Builders<AccountingSubject>.Filter;

            var filter = builder.Where(item => 
                item.AccountingSubjectCode.Contains(query) ||
                item.AccountingSubjectName.Contains(query) ||
                item.AccountingSubjectDescription.Contains(query));

            return this.TEntityCollection.Find(filter).SortBy(item => item.AccountingSubjectType).ThenBy(item => item.AccountingSubjectCode).Limit(10).ToList();
        }

        public IEnumerable<AccountingSubject> FetchBy(AccountingSubject accountingSubject)
        {
            var filter = this.getFilterDefinition(accountingSubject);
            return this.TEntityCollection.Find(filter).SortBy(item => item.AccountingSubjectType).ThenBy(item => item.AccountingSubjectCode).ToList();
        }

        public IEnumerable<AccountingSubject> FetchBy(IEnumerable<string> accountingSubjectCodes)
        {
            return this.TEntityCollection.Find(item => accountingSubjectCodes.Contains(item.AccountingSubjectCode)).ToList();
        }

        public void Delete(AccountingSubject accountingSubject)
        {
            var filter = this.getFilterDefinition(accountingSubject);
            this.TEntityCollection.DeleteMany(filter);
        }

        private FilterDefinition<AccountingSubject> getFilterDefinition(AccountingSubject accountingSubject)
        {
            var builder = Builders<AccountingSubject>.Filter;

            var filter = builder.Where(item => true);

            if (accountingSubject.AccountingSubjectType != AccountingSubjectType.None)
                filter = filter & builder.Where(item => item.AccountingSubjectType == accountingSubject.AccountingSubjectType);

            if (!string.IsNullOrEmpty(accountingSubject.AccountingSubjectCode))
                filter = filter & builder.Where(item => item.AccountingSubjectCode.Contains(accountingSubject.AccountingSubjectCode));

            if (!string.IsNullOrEmpty(accountingSubject.AccountingSubjectDescription))
                filter = filter & builder.Where(item => item.AccountingSubjectDescription.Contains(accountingSubject.AccountingSubjectDescription));

            if (!string.IsNullOrEmpty(accountingSubject.AccountingSubjectName))
                filter = filter & builder.Where(item => item.AccountingSubjectName.Contains(accountingSubject.AccountingSubjectName));

            return filter;
        }
    }
}