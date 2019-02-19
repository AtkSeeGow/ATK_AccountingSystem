using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using WebAccountingSystemMainProject.Domain;
using WebAccountingSystemMainProject.Domain.Enum;
using WebAccountingSystemMainProject.Domain.Options;

namespace WebAccountingSystemMainProject.Repository
{
    public class EntryRepository : GenericRepository<Entry, Guid>
    {
        private readonly BookRepository bookRepository;

        public EntryRepository(
            MongoDBOptions mongoDBOptions,
            BookRepository bookRepository) : base(mongoDBOptions)
        {
            this.bookRepository = bookRepository;
        }

        public IEnumerable<string> GroupEntryBookNameBy(EntryForCondition entryForCondition)
        {
            var builder = Builders<Entry>.Filter;

            var filter = builder.Where(item => item.EntryRecorder == entryForCondition.EntryRecorder);

            if (!string.IsNullOrEmpty(entryForCondition.EntryBookName))
                filter = filter & builder.Where(item => item.EntryBookName.Contains(entryForCondition.EntryBookName));

            var groups = this.TEntityCollection.Aggregate().Match(filter).Group(
                        key => new { key.EntryBookName, key.EntryRecorder },
                        group => new
                        {
                            KeyObject = group.Key,
                            Count = group.Count()
                        })
                        .ToList()
                        .OrderByDescending(item => item.Count)
                        .ThenBy(item => item.KeyObject.EntryBookName);

            var count = 0;
            var result = new List<string>();
            foreach (var group in groups)
            {
                count++;
                if(count < 10)
                    result.Add(group.KeyObject.EntryBookName);
            }

            return result;
        }

        public IEnumerable<Entry> FetchBy(EntryForCondition entryForCondition)
        {
            var filter = this.getFilterDefinition(entryForCondition);
            return this.TEntityCollection.Find(filter).SortBy(item => item.EntryTradingDay).ThenBy(item => item.EntrySummary).ThenBy(item => item.EntryType).ToList();
        }

        public void Delete(EntryForCondition entryForCondition)
        {
            var filter = this.getFilterDefinition(entryForCondition);
            this.TEntityCollection.DeleteMany(filter);
        }

        private FilterDefinition<Entry> getFilterDefinition(EntryForCondition entryForCondition)
        {
            var builder = Builders<Entry>.Filter;

            var filterDefinitionsForPermission = new List<FilterDefinition<Entry>>();
            filterDefinitionsForPermission.Add(builder.Eq(item => item.EntryRecorder, entryForCondition.EntryRecorder));
            var books = this.bookRepository.FetchBy(entryForCondition.EntryRecorder);
            foreach (var book in books)
            {
                FilterDefinition<Entry> filterDefinition =
                    builder.Eq(item => item.EntryBookName, book.BookName) &
                    builder.Eq(item => item.EntryRecorder, book.BookRecorder);
                filterDefinitionsForPermission.Add(filterDefinition);
            }
            var filter = Builders<Entry>.Filter.Or(filterDefinitionsForPermission);

            //------------------------------------------------------------------------------------------------------------------------------

            var entryBookNames = entryForCondition.EntryBookName.Split(',');
            for (int i = 0; i < entryBookNames.Length; i++)
                entryBookNames[i] = entryBookNames[i].Trim();

            var filterDefinitionsForEntryBookName = new List<FilterDefinition<Entry>>();
            foreach (var entryBookName in entryBookNames)
            {
                FilterDefinition<Entry> filterDefinition = builder.Regex(item => item.EntryBookName, entryBookName);
                filterDefinitionsForEntryBookName.Add(filterDefinition);
            }
            filter = filter & builder.Or(filterDefinitionsForEntryBookName);

            //------------------------------------------------------------------------------------------------------------------------------

            var entryAccountingSubjects = entryForCondition.EntryAccountingSubject.Split(',');
            for (int i = 0; i < entryAccountingSubjects.Length; i++)
                entryAccountingSubjects[i] = entryAccountingSubjects[i].Trim();

            var filterDefinitionsForEntryAccountingSubject = new List<FilterDefinition<Entry>>();
            foreach (var entryAccountingSubject in entryAccountingSubjects)
            {
                FilterDefinition<Entry> filterDefinition = builder.Regex(item => item.EntryAccountingSubject, entryAccountingSubject);
                filterDefinitionsForEntryAccountingSubject.Add(filterDefinition);
            }
            filter = filter & builder.Or(filterDefinitionsForEntryAccountingSubject);

            //------------------------------------------------------------------------------------------------------------------------------

            if (entryForCondition.EntryTradingDayBegin.HasValue)
                filter = filter & builder.Where(item => item.EntryTradingDay >= entryForCondition.EntryTradingDayBegin);

            if (entryForCondition.EntryTradingDayEnd.HasValue)
                filter = filter & builder.Where(item => item.EntryTradingDay <= entryForCondition.EntryTradingDayEnd.Value.AddDays(1).AddMilliseconds(-1));

            if (!string.IsNullOrEmpty(entryForCondition.EntrySummary))
                filter = filter & builder.Where(item => item.EntrySummary.Contains(entryForCondition.EntrySummary));

            return filter;
        }
    }
}