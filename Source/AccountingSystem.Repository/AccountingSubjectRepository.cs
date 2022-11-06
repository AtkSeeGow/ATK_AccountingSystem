using AccountingSystem.Domain;
using AccountingSystem.Domain.Enum;
using AccountingSystem.Domain.Options;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;

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
            var filter = builder.Where(item => item.Code.Contains(query) || item.Name.Contains(query) || item.Description.Contains(query));
            return this.TEntityCollection.Find(filter).SortBy(item => item.Type).ThenBy(item => item.Code).Limit(10).ToList();
        }

        public IEnumerable<AccountingSubject> FetchBy(AccountingSubject accountingSubject)
        {
            var filter = this.getFilterDefinition(accountingSubject);
            return this.TEntityCollection.Find(filter).SortBy(item => item.Type).ThenBy(item => item.Code).ToList();
        }

        public IEnumerable<AccountingSubject> FetchBy(IEnumerable<string> accountingSubjectCodes)
        {
            return this.TEntityCollection.Find(item => accountingSubjectCodes.Contains(item.Code)).ToList();
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

            if (accountingSubject.Type != AccountingSubjectType.None)
                filter = filter & builder.Where(item => item.Type == accountingSubject.Type);

            if (!string.IsNullOrEmpty(accountingSubject.Code))
                filter = filter & builder.Where(item => item.Code.Contains(accountingSubject.Code));

            if (!string.IsNullOrEmpty(accountingSubject.Description))
                filter = filter & builder.Where(item => item.Description.Contains(accountingSubject.Description));

            if (!string.IsNullOrEmpty(accountingSubject.Name))
                filter = filter & builder.Where(item => item.Name.Contains(accountingSubject.Name));

            return filter;
        }
    }
}