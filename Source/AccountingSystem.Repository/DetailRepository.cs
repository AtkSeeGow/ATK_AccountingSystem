using AccountingSystem.Domain;
using AccountingSystem.Domain.Options;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;

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

            return this.TEntityCollection.Find(filter).SortByDescending(item => item.TradingDay).ToList();
        }
    }
}