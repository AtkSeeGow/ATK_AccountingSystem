using AccountingSystem.Domain;
using AccountingSystem.Domain.Options;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;

namespace AccountingSystem.Repository
{
    public class BookRepository : GenericRepository<Book, Guid>
    {
        public BookRepository(MongoDBOptions mongoDBOptions) : base(mongoDBOptions)
        {
        }

        public IEnumerable<Book> FetchBy(string accountId)
        {
            return this.TEntityCollection.Find(item => item.Reader == accountId).SortBy(item => item.Name).ThenBy(item => item.Reader).ToList();
        }

        public IEnumerable<Book> FetchBy(Book book)
        {
            var filter = this.getFilterDefinition(book);
            return this.TEntityCollection.Find(filter).SortBy(item => item.Name).ThenBy(item => item.Reader).ToList();
        }

        public void Delete(Book book)
        {
            var filter = this.getFilterDefinition(book);
            this.TEntityCollection.DeleteMany(filter);
        }

        private FilterDefinition<Book> getFilterDefinition(Book book)
        {
            var builder = Builders<Book>.Filter;

            var bookNames = book.Name.Split(',');
            for (int i = 0; i < bookNames.Length; i++)
                bookNames[i] = bookNames[i].Trim();

            var filterDefinitions = new List<FilterDefinition<Book>>();
            foreach (var bookName in bookNames)
            {
                FilterDefinition<Book> filterDefinition = builder.Regex(item => item.Name, bookName);
                filterDefinitions.Add(filterDefinition);
            }

            var filter = builder.Where(item => item.Recorder == book.Recorder) & builder.Or(filterDefinitions);

            if (!string.IsNullOrEmpty(book.Reader))
                filter = filter & builder.Where(item => item.Reader.Contains(book.Reader));

            return filter;
        }
    }
}