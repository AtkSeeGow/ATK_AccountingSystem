using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using AccountingSystem.Domain;
using AccountingSystem.Repository;

namespace AccountingSystem.Web
{
    public class BookController : Controller
    {
        private readonly ILogger logger;
        private readonly BookRepository bookRepository;
        private readonly EntryRepository entryRepository;

        public BookController(
            ILogger<BookController> logger,
            BookRepository bookRepository,
            EntryRepository entryRepository)
        {
            this.logger = logger;
            this.bookRepository = bookRepository;
            this.entryRepository = entryRepository;
        }

        [HttpGet]
        public IEnumerable<string> SelectNameBy(string query)
        {
            var accountId = HttpContext.User.Claims.FirstOrDefault(p => p.Type == ClaimTypes.Name).Value;

            var entryForCondition = new EntryForCondition();
            entryForCondition.EntryRecorder = HttpContext.User.Claims.FirstOrDefault(p => p.Type == ClaimTypes.Name).Value;
            entryForCondition.EntryBookName = query;

            var result = this.entryRepository.GroupEntryBookNameBy(entryForCondition).ToHashSet();

            var books = this.bookRepository.FetchBy(accountId).Where(item => item.BookName.Contains(entryForCondition.EntryBookName));
            foreach (var book in books)
                result.Add(book.BookName);

            return result;
        }

        [HttpPost]
        public IEnumerable<Book> FetchBy([FromBody]Book conditionForFilter)
        {
            conditionForFilter.BookRecorder = HttpContext.User.Claims.FirstOrDefault(p => p.Type == ClaimTypes.Name).Value;
            return this.bookRepository.FetchBy(conditionForFilter);
        }

        [HttpPost]
        public ActionResult SaveBy([FromBody]dynamic data)
        {
            var result = new ValidResult();

            Book conditionForFilter = JsonConvert.DeserializeObject<Book>(JsonConvert.SerializeObject(data.conditionForFilter));
            List<Book> booksFromClient = JsonConvert.DeserializeObject<List<Book>>(JsonConvert.SerializeObject(data.books));

            var booksFromEmpty = booksFromClient.Where(item => item.IsEmptyInstance()).ToList();
            foreach (var bookFromEmpty in booksFromEmpty)
                booksFromClient.Remove(bookFromEmpty);

            foreach (var bookFromClient in booksFromClient)
                bookFromClient.BookRecorder = HttpContext.User.Claims.FirstOrDefault(p => p.Type == ClaimTypes.Name).Value;

            if (!result.IsValid)
                return BadRequest(result);

            var booksFromDB = this.FetchBy(conditionForFilter);

            try
            {
                bookRepository.Delete(conditionForFilter);

                if (booksFromClient.Count() > 0)
                    bookRepository.CreateAll(booksFromClient).Wait();
            }
            catch (Exception exception)
            {
                logger.LogError(JsonConvert.SerializeObject(booksFromDB));
                throw exception;
            }

            return Ok(result);
        }
    }
}
