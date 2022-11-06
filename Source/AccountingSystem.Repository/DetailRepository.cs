using AccountingSystem.Domain;
using AccountingSystem.Domain.Enum;
using AccountingSystem.Domain.Options;
using MongoDB.Bson;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http.Headers;

namespace AccountingSystem.Repository
{
    public class DetailRepository : GenericRepository<Detail, Guid>
    {
        public DetailRepository(
            MongoDBOptions mongoDBOptions) : base(mongoDBOptions)
        {
        }

        public IEnumerable<string> GroupNameBy(Detail condition)
        {
            var builder = Builders<Detail>.Filter;

            var filter = builder.Where(item => item.Recorder == condition.Recorder);

            if (!string.IsNullOrEmpty(condition.Name))
                filter = filter & builder.Where(item => item.Name.Contains(condition.Name));

            var groups = this.TEntityCollection.Aggregate().Match(filter).Group(
                        key => new { key.Name, key.Recorder },
                        group => new
                        {
                            KeyObject = group.Key,
                            Count = group.Count()
                        })
                        .ToList()
                        .OrderByDescending(item => item.Count)
                        .ThenBy(item => item.KeyObject.Name);

            var count = 0;
            var result = new List<string>();
            foreach (var group in groups)
            {
                count++;
                if (count < 10)
                    result.Add(group.KeyObject.Name);
            }

            return result;
        }

        public IEnumerable<Detail> FetchBy(Condition condition)
        {
            var filter = this.getFilterDefinition(condition);
            return this.TEntityCollection.Find(filter).SortByDescending(item => item.TradingDay).ToList();
        }

        public IList<KeyValuePair<string, double>> GroupBy(DateTime? tradingDayBegin, DateTime? tradingDayEnd)
        {
            var result = new Dictionary<string, double>();

            var builder = Builders<Detail>.Filter;

            var filter = builder.Where(item => true);
            if (tradingDayBegin.HasValue)
                filter = filter & builder.Where(item => item.TradingDay >= tradingDayBegin.Value);
            if (tradingDayEnd.HasValue)
                filter = filter & builder.Where(item => item.TradingDay <= tradingDayEnd.Value);

            var groups = TEntityCollection.Aggregate().Match(filter)
                .Unwind(item => item.Entrys)
                .Match(
                    new BsonDocument{
                        {
                            "Entrys.AccountingSubjectCode", new BsonDocument {
                                { "$nin", new BsonArray{
                                    {"400000"},
                                    {"500000"}
                                }}
                            }
                        }
                    })
                .Group<BsonDocument>(
                        new BsonDocument{
                        {
                            "_id", new BsonDocument{
                                { "AccountingSubjectCode", "$Entrys.AccountingSubjectCode" },
                                { "Type", "$Entrys.Type" }
                            }
                        },
                        {
                            "Amount", new BsonDocument{{"$sum", "$Entrys.Amount" } }
                        }})
                .ToList();


            foreach (var group in groups)
            {
                var accountingSubjectCode = group.GetValue("_id").AsBsonDocument.GetValue("AccountingSubjectCode").AsString;
                var type = (EntryType)(group.GetValue("_id").AsBsonDocument.GetValue("Type").AsInt32);
                var amount = group.GetValue("Amount").AsDouble;

                if (type == EntryType.Credits)
                    amount *= -1;

                if (!result.ContainsKey(accountingSubjectCode))
                    result.Add(accountingSubjectCode, amount);
                else
                    result[accountingSubjectCode] = result[accountingSubjectCode] + amount;
            }

            return result.ToList();
        }

        public IEnumerable<Guid> GetPackageInformationIds()
        {
            var result = new HashSet<Guid>();
            
            var packageInformationIds = this.TEntityCollection.Find(item => true).Project(item => item.PackageInformation.Id).ToList();
            foreach (var packageInformationId in packageInformationIds)
                result.Add(packageInformationId);

            return result;
        }

        private FilterDefinition<Detail> getFilterDefinition(Condition condition)
        {
            var builder = Builders<Detail>.Filter;

            var filter = builder.Where(item => true);

            if (!string.IsNullOrEmpty(condition.Name))
                filter = filter & builder.Where(item => item.Name.Contains(condition.Name));

            if (!string.IsNullOrEmpty(condition.AccountingSubjectCode))
                filter = filter & builder.Where(item => item.Entrys.Any(ee => ee.AccountingSubjectCode.Contains(condition.AccountingSubjectCode)));

            if (!string.IsNullOrEmpty(condition.Summary))
                filter = filter & builder.Where(item => item.Entrys.Any(ee => ee.Summary.Contains(condition.Summary)));

            if (condition.TradingDayBegin.HasValue)
                filter = filter & builder.Where(item => item.TradingDay >= condition.TradingDayBegin.Value);

            if (condition.TradingDayEnd.HasValue)
                filter = filter & builder.Where(item => item.TradingDay <= condition.TradingDayEnd.Value);

            return filter;
        }
    }
}