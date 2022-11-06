using AccountingSystem.Domain;
using AccountingSystem.Repository;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;

namespace AccountingSystem.Web.Api
{
    [Route("Api/[controller]/[action]")]
    [ApiController]
    [Authorize(AuthenticationSchemes = "PermissionHandler")]
    public class BookController : Controller
    {
        private readonly ILogger logger;
        private readonly BookRepository bookRepository;
        private readonly DetailRepository detailRepository;

        public BookController(
            ILogger<BookController> logger,
            BookRepository bookRepository,
            DetailRepository detailRepository)
        {
            this.logger = logger;
            this.bookRepository = bookRepository;
            this.detailRepository = detailRepository;
        }

        [HttpGet]
        public IEnumerable<string> SelectNameBy(string query)
        {
            var accountId = HttpContext.User.Claims.FirstOrDefault(p => p.Type == ClaimTypes.Name).Value;

            var condition = new Detail();
            condition.Recorder = HttpContext.User.Claims.FirstOrDefault(p => p.Type == ClaimTypes.Name).Value;
            condition.Name = query;

            var result = this.detailRepository.GroupNameBy(condition).ToHashSet();

            var books = this.bookRepository.FetchBy(accountId).Where(item => item.Name.Contains(condition.Name));
            foreach (var book in books)
                result.Add(book.Name);

            return result;
        }

        [HttpPost]
        public IEnumerable<Book> FetchBy([FromBody]Book conditionForFilter)
        {
            conditionForFilter.Recorder = HttpContext.User.Claims.FirstOrDefault(p => p.Type == ClaimTypes.Name).Value;
            return this.bookRepository.FetchBy(conditionForFilter);
        }

        [HttpPost]
        public ActionResult SaveBy([FromBody]dynamic data)
        {
            var result = new ValidResult();

            Book condition = JsonConvert.DeserializeObject<Book>(JsonConvert.SerializeObject(data.conditionForFilter));
            List<Book> clientBooks = JsonConvert.DeserializeObject<List<Book>>(JsonConvert.SerializeObject(data.books));

            var emptyBooks = clientBooks.Where(item => item.IsEmptyInstance()).ToList();
            foreach (var bookFromEmpty in emptyBooks)
                clientBooks.Remove(bookFromEmpty);

            foreach (var clientBook in clientBooks)
                clientBook.Recorder = HttpContext.User.Claims.FirstOrDefault(p => p.Type == ClaimTypes.Name).Value;

            if (!result.IsValid)
                return BadRequest(result);

            var dataBaseBooks = this.FetchBy(condition);

            try
            {
                bookRepository.Delete(condition);

                if (clientBooks.Count() > 0)
                    bookRepository.CreateAll(clientBooks).Wait();
            }
            catch (Exception exception)
            {
                logger.LogError(JsonConvert.SerializeObject(dataBaseBooks));
                throw exception;
            }

            return Ok(result);
        }
    }
}
