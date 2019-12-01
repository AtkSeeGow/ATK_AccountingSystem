using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using WebAccountingSystemMainProject.Domain;
using WebAccountingSystemMainProject.Repository;

namespace WebAccountingSystemMainProject.Web
{
    public class EntryController : Controller
    {
        private readonly ILogger logger;
        private readonly AccountingSubjectRepository accountingSubjectRepository;
        private readonly EntryRepository entryRepository;

        public EntryController(
            ILogger<EntryController> logger,
            AccountingSubjectRepository accountingSubjectRepository,
            EntryRepository entryRepository)
        {
            this.logger = logger;
            this.accountingSubjectRepository = accountingSubjectRepository;
            this.entryRepository = entryRepository;
        }

        [HttpPost]
        public IEnumerable<Entry> FetchBy([FromBody]EntryForCondition conditionForFilter)
        {
            conditionForFilter.EntryRecorder = HttpContext.User.Claims.FirstOrDefault(p => p.Type == ClaimTypes.Name).Value;

            if (conditionForFilter.EntryTradingDayBegin.HasValue)
                conditionForFilter.EntryTradingDayBegin = conditionForFilter.EntryTradingDayBegin.Value.ToLocalTime();

            if (conditionForFilter.EntryTradingDayEnd.HasValue)
                conditionForFilter.EntryTradingDayEnd = conditionForFilter.EntryTradingDayEnd.Value.ToLocalTime();

            var entrys = this.entryRepository.FetchBy(conditionForFilter);
            var accountingSubjects = this.accountingSubjectRepository.FetchBy(entrys.Select(item => item.EntryAccountingSubject));

            foreach (var entry in entrys)
            {
                var accountingSubject = accountingSubjects.FirstOrDefault(item => item.AccountingSubjectCode == entry.EntryAccountingSubject);
                if (accountingSubject != null)
                    entry.EntryAccountingSubject = string.Format("{0}({1})", accountingSubject.AccountingSubjectCode, accountingSubject.AccountingSubjectName);
            }

            return entrys;
        }

        [HttpPost]
        public IEnumerable<KeyValuePair<AccountingSubject, IList<Entry>>> LedgerBy([FromBody]EntryForCondition conditionForFilter)
        {
            conditionForFilter.EntryRecorder = HttpContext.User.Claims.FirstOrDefault(p => p.Type == ClaimTypes.Name).Value;

            if (conditionForFilter.EntryTradingDayBegin.HasValue)
                conditionForFilter.EntryTradingDayBegin = conditionForFilter.EntryTradingDayBegin.Value.ToLocalTime();

            if (conditionForFilter.EntryTradingDayEnd.HasValue)
                conditionForFilter.EntryTradingDayEnd = conditionForFilter.EntryTradingDayEnd.Value.ToLocalTime();

            var temporary = new Dictionary<string, IList<Entry>>();

            var entrys = this.entryRepository.FetchBy(conditionForFilter);
            foreach(var entry in entrys)
            {
                if (!temporary.ContainsKey(entry.EntryAccountingSubject))
                    temporary.Add(entry.EntryAccountingSubject, new List<Entry>());
                temporary[entry.EntryAccountingSubject].Add(entry);
            }

            var result = new List<KeyValuePair<AccountingSubject, IList<Entry>>>();

            var accountingSubjects = this.accountingSubjectRepository.FetchBy(temporary.Keys);
            foreach (var keyValuePair in temporary)
            {
                var accountingSubject = accountingSubjects.FirstOrDefault(item => item.AccountingSubjectCode == keyValuePair.Key);
                if (accountingSubject != null)
                    result.Add(new KeyValuePair<AccountingSubject, IList<Entry>>(accountingSubject, keyValuePair.Value));
                else
                    result.Add(new KeyValuePair<AccountingSubject, IList<Entry>>(new AccountingSubject() { AccountingSubjectCode = keyValuePair.Key, AccountingSubjectType = Domain.Enum.AccountingSubjectType.None }, keyValuePair.Value));
            }

            result = result.OrderBy(item => item.Key.AccountingSubjectType).ThenBy(item => item.Key.AccountingSubjectCode).ToList();
            return result;
        }

        [HttpPost]
        public ActionResult SaveBy([FromBody]dynamic data)
        {
            var result = new ValidResult();

            EntryForCondition conditionForFilter = JsonConvert.DeserializeObject<EntryForCondition>(JsonConvert.SerializeObject(data.conditionForFilter));
            List<Entry> entrysFromClient = JsonConvert.DeserializeObject<List<Entry>>(JsonConvert.SerializeObject(data.entrys));

            var entrysFromEmpty = entrysFromClient.Where(item => item.IsEmptyInstance()).ToList();
            foreach (var entryFromEmpty in entrysFromEmpty)
                entrysFromClient.Remove(entryFromEmpty);
            
            foreach (var entryFromClient in entrysFromClient)
                entryFromClient.EntryRecorder = HttpContext.User.Claims.FirstOrDefault(p => p.Type == ClaimTypes.Name).Value;

            if(entrysFromClient.Any(item => item.EntryType == Domain.Enum.EntryType.None))
                result.ErrorMessages.Add(Guid.NewGuid().ToString(), "驗證出現錯誤，借貸方為必填項目..");

            if (entrysFromClient.Any(item => item.EntryAmount == 0))
                result.ErrorMessages.Add(Guid.NewGuid().ToString(), "驗證出現錯誤，金額欄位不得為零..");

            if(entrysFromClient.Where(item => item.EntryType == Domain.Enum.EntryType.Debits).Sum(item => item.EntryAmount) != 
               entrysFromClient.Where(item => item.EntryType == Domain.Enum.EntryType.Credits).Sum(item => item.EntryAmount))
                result.ErrorMessages.Add(Guid.NewGuid().ToString(), "驗證出現錯誤，借貸金額不平衡..");

            var accountingSubjectCodes = entrysFromClient.Select(item => item.EntryAccountingSubject).ToArray();
            var accountingSubjects = this.accountingSubjectRepository.FetchBy(accountingSubjectCodes);
            foreach(var entryFromClient in entrysFromClient)
            {
                var accountingSubject = accountingSubjects.FirstOrDefault(item => item.AccountingSubjectCode == entryFromClient.EntryAccountingSubject);
                if (accountingSubject == null)
                    result.ErrorMessages.Add(Guid.NewGuid().ToString(), string.Format("驗證出現錯誤，會計科目({0})不存在..", entryFromClient.EntryAccountingSubject));
            }

            if (!result.IsValid)
                return BadRequest(result);

            var entrysFromDB = this.FetchBy(conditionForFilter);

            try
            {
                entryRepository.Delete(conditionForFilter);

                if (entrysFromClient.Count() > 0)
                    entryRepository.CreateAll(entrysFromClient).Wait();
            }
            catch (Exception exception)
            {
                logger.LogError(JsonConvert.SerializeObject(entrysFromDB));
                throw exception;
            }

            return Ok(result);
        }
    }
}
