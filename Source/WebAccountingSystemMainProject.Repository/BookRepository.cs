using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using WebAccountingSystemMainProject.Domain;
using WebAccountingSystemMainProject.Domain.Options;

namespace WebAccountingSystemMainProject.Repository
{
    public class BookRepository : GenericRepository<Book, Guid>
    {
        public BookRepository(MongoDBOptions mongoDBOptions) : base(mongoDBOptions)
        {
        }

        public IEnumerable<Book> FetchBy(string accountId)
        {
            return this.TEntityCollection.Find(item => item.BookReader == accountId).SortBy(item => item.BookName).ThenBy(item => item.BookReader).ToList();
        }

        public IEnumerable<Book> FetchBy(Book book)
        {
            var filter = this.getFilterDefinition(book);
            return this.TEntityCollection.Find(filter).SortBy(item => item.BookName).ThenBy(item => item.BookReader).ToList();
        }

        public void Delete(Book book)
        {
            var filter = this.getFilterDefinition(book);
            this.TEntityCollection.DeleteMany(filter);
        }

        private FilterDefinition<Book> getFilterDefinition(Book book)
        {
            var builder = Builders<Book>.Filter;

            var bookNames = book.BookName.Split(',');
            for (int i = 0; i < bookNames.Length; i++)
                bookNames[i] = bookNames[i].Trim();

            var filterDefinitions = new List<FilterDefinition<Book>>();
            foreach (var bookName in bookNames)
            {
                FilterDefinition<Book> filterDefinition = builder.Regex(item => item.BookName, bookName);
                filterDefinitions.Add(filterDefinition);
            }

            var filter = builder.Where(item => item.BookRecorder == book.BookRecorder) & builder.Or(filterDefinitions);

            if (!string.IsNullOrEmpty(book.BookReader))
                filter = filter & builder.Where(item => item.BookReader.Contains(book.BookReader));

            return filter;
        }
    }
}