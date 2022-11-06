using AccountingSystem.Domain;
using AccountingSystem.Repository;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;

namespace AccountingSystem.Web.Api
{
    [Route("Api/[controller]/[action]")]
    [ApiController]
    [Authorize(AuthenticationSchemes = "PermissionHandler")]
    public class AccountingSubjectController : Controller
    {
        private readonly ILogger logger;
        private readonly AccountingSubjectRepository accountingSubjectRepository;

        public AccountingSubjectController(
            ILogger<AccountingSubjectController> logger,
            AccountingSubjectRepository accountingSubjectRepository)
        {
            this.logger = logger;
            this.accountingSubjectRepository = accountingSubjectRepository;
        }

        [HttpGet]
        public IEnumerable<AccountingSubject> Autocomplete(string query)
        {
            return this.accountingSubjectRepository.Autocomplete(query);
        }

        [HttpPost]
        public IEnumerable<AccountingSubject> FetchBy([FromBody]AccountingSubject conditionForFilter)
        {
            return this.accountingSubjectRepository.FetchBy(conditionForFilter);
        }

        [HttpPost]
        public ActionResult SaveBy([FromBody]dynamic data)
        {
            AccountingSubject conditionForFilter = JsonConvert.DeserializeObject<AccountingSubject>(JsonConvert.SerializeObject(data.conditionForFilter));
            List<AccountingSubject> accountingSubjectsFromClient = JsonConvert.DeserializeObject<List<AccountingSubject>>(JsonConvert.SerializeObject(data.accountingSubjects));

            var accountingSubjectsFromEmpty = accountingSubjectsFromClient.Where(item => item.IsEmptyInstance()).ToList();
            foreach (var accountingSubjectFromEmpty in accountingSubjectsFromEmpty)
                accountingSubjectsFromClient.Remove(accountingSubjectFromEmpty);

            var accountingSubjectsFromDB = this.FetchBy(conditionForFilter);

            try
            {
                accountingSubjectRepository.Delete(conditionForFilter);

                if (accountingSubjectsFromClient.Count() > 0)
                    accountingSubjectRepository.CreateAll(accountingSubjectsFromClient).Wait();
            }
            catch(Exception exception)
            {
                logger.LogError(JsonConvert.SerializeObject(accountingSubjectsFromDB));
                throw exception;
            }

            return Ok(new ValidResult());
        }
    }
}
