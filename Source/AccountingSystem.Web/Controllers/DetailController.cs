using AccountingSystem.Domain;
using AccountingSystem.Domain.Enum;
using AccountingSystem.Repository;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Dynamic;
using System.Linq;
using System.Security.Claims;

namespace AccountingSystem.Web
{
    public class DetailController : Controller
    {
        private readonly ILogger logger;
        private readonly AccountingSubjectRepository accountingSubjectRepository;
        private readonly DetailRepository detailRepository;

        public DetailController(
            ILogger<DetailController> logger,
            AccountingSubjectRepository accountingSubjectRepository,
            DetailRepository detailRepository)
        {
            this.logger = logger;
            this.accountingSubjectRepository = accountingSubjectRepository;
            this.detailRepository = detailRepository;
        }

        [HttpPost]
        public IEnumerable<Detail> FetchBy([FromBody]Condition condition)
        {
            condition.Recorder = HttpContext.User.Claims.FirstOrDefault(p => p.Type == ClaimTypes.Name).Value;

            if (condition.TradingDayBegin.HasValue)
                condition.TradingDayBegin = condition.TradingDayBegin.Value.ToLocalTime();

            if (condition.TradingDayEnd.HasValue)
                condition.TradingDayEnd = condition.TradingDayEnd.Value.ToLocalTime().AddDays(1).AddMilliseconds(-1);

            var details = this.detailRepository.FetchBy(condition);

            var accountingSubjectCodes = new List<string>();
            foreach (var detail in details)
                accountingSubjectCodes.AddRange(detail.Entrys.Select(ii => ii.AccountingSubjectCode).ToArray());

            var accountingSubjects = this.accountingSubjectRepository.FetchBy(accountingSubjectCodes);

            foreach (var detail in details)
            {
                foreach(var entry in detail.Entrys)
                {
                    var accountingSubject = accountingSubjects.FirstOrDefault(item => item.Code == entry.AccountingSubjectCode);
                    if (accountingSubject != null)
                        entry.AccountingSubjectCode = string.Format("{0}({1})", accountingSubject.Code, accountingSubject.Name);
                }
            }

            return details;
        }

        [HttpPost]
        public ActionResult SaveBy([FromBody]dynamic target)
        {
            Detail detail = JsonConvert.DeserializeObject<Detail>(JsonConvert.SerializeObject(target));
            detail.Recorder = HttpContext.User.Claims.FirstOrDefault(p => p.Type == ClaimTypes.Name).Value;

            var validResult = new ValidResult();

            this.validBy(validResult, detail);

            if (!validResult.IsValid)
                return BadRequest(validResult);

            try
            {
                if (detailRepository.Exist(detail.Id))
                    detailRepository.Update(detail);
                else
                    detailRepository.Create(detail).Wait();
            }
            catch (Exception exception)
            {
                logger.LogError(JsonConvert.SerializeObject(detail));
                throw exception;
            }

            return Ok(validResult);
        }

        [HttpPost]
        public ActionResult DeleteBy([FromBody]dynamic target)
        {
            var recorder = HttpContext.User.Claims.FirstOrDefault(p => p.Type == ClaimTypes.Name).Value;

            Detail detail = JsonConvert.DeserializeObject<Detail>(JsonConvert.SerializeObject(target));

            try
            {
                detailRepository.Delete(item => item.Id == detail.Id && item.Recorder == recorder).Wait();
            }
            catch (Exception exception)
            {
                logger.LogError(JsonConvert.SerializeObject(detail));
                throw exception;
            }

            return Ok(new ValidResult());
        }

        [HttpPost]
        public IEnumerable<KeyValuePair<AccountingSubject, IList<GraphEntry>>> LedgerBy([FromBody]Condition condition)
        {
            condition.Recorder = HttpContext.User.Claims.FirstOrDefault(p => p.Type == ClaimTypes.Name).Value;

            if (condition.TradingDayBegin.HasValue)
                condition.TradingDayBegin = condition.TradingDayBegin.Value.ToLocalTime();

            if (condition.TradingDayEnd.HasValue)
                condition.TradingDayEnd = condition.TradingDayEnd.Value.ToLocalTime().AddDays(1).AddMilliseconds(-1);

            var accountingSubjects = this.accountingSubjectRepository.FetchAll().Result;

            var result = new Dictionary<AccountingSubject, IList<GraphEntry>>();

            var details = this.detailRepository.FetchBy(condition);
            foreach(var detail in details)
            {
                foreach(var entry in detail.Entrys)
                {
                    var accountingSubject = accountingSubjects.FirstOrDefault(item => item.Code == entry.AccountingSubjectCode);
                    if (accountingSubject == null)
                        accountingSubject = new AccountingSubject() { Code = entry.AccountingSubjectCode, Type = AccountingSubjectType.None };

                    if (!result.ContainsKey(accountingSubject))
                        result.Add(accountingSubject, new List<GraphEntry>());

                    result[accountingSubject].Add(new GraphEntry (){ TradingDay = detail.TradingDay.Value, Name = detail.Name, Entry = entry });
                }
            }

            return result.OrderBy(item => item.Key.Type).ThenBy(item => item.Key.Code).ToList();
        }

        [HttpPost]
        public Dictionary<AccountingSubjectType, IList<dynamic>> GraphBy([FromBody]Condition condition)
        {
            var accountingSubjects = accountingSubjectRepository.FetchAll().Result;
            var details = this.FetchBy(condition);

            var graphEntrys = new List<GraphEntry>();
            foreach (var detail in details)
                foreach (var entry in detail.Entrys)
                    graphEntrys.Add(new GraphEntry() { TradingDay = detail.TradingDay.Value, Entry = entry });

            var result = new Dictionary<AccountingSubjectType, IList<dynamic>>();
            result.Add(AccountingSubjectType.Assets, new List<dynamic>());
            result.Add(AccountingSubjectType.Liabilities, new List<dynamic>());
            result.Add(AccountingSubjectType.Revenues, new List<dynamic>());
            result.Add(AccountingSubjectType.Expenses, new List<dynamic>());

            var date = condition.TradingDayBegin.Value;

            var tradingDayBegin = new DateTime(date.Year, date.Month, 1);
            var tradingDayEnd = tradingDayBegin.AddMonths(condition.MonthInterval);
            this.graphBy(AccountingSubjectType.Assets, condition.TradingDayBegin.Value, tradingDayEnd, graphEntrys, accountingSubjects, result);
            this.graphBy(AccountingSubjectType.Liabilities, condition.TradingDayBegin.Value, tradingDayEnd, graphEntrys, accountingSubjects, result);
            this.graphBy(AccountingSubjectType.Revenues, tradingDayBegin, tradingDayEnd, graphEntrys, accountingSubjects, result);
            this.graphBy(AccountingSubjectType.Expenses, tradingDayBegin, tradingDayEnd, graphEntrys, accountingSubjects, result);

            while (condition.TradingDayEnd >= tradingDayEnd)
            {
                tradingDayBegin = tradingDayEnd;
                tradingDayEnd = tradingDayBegin.AddMonths(condition.MonthInterval);
                this.graphBy(AccountingSubjectType.Assets, condition.TradingDayBegin.Value, tradingDayEnd, graphEntrys, accountingSubjects, result);
                this.graphBy(AccountingSubjectType.Liabilities, condition.TradingDayBegin.Value, tradingDayEnd, graphEntrys, accountingSubjects, result);
                this.graphBy(AccountingSubjectType.Revenues, tradingDayBegin, tradingDayEnd, graphEntrys, accountingSubjects, result);
                this.graphBy(AccountingSubjectType.Expenses, tradingDayBegin, tradingDayEnd, graphEntrys, accountingSubjects, result);
            }

            return result;
        }

        #region Pirvate

        private void validBy(ValidResult validResult, Detail detail)
        {
            var entrys = detail.Entrys;

            if (entrys.Any(item => item.Type == Domain.Enum.EntryType.None))
                validResult.ErrorMessages.Add(Guid.NewGuid().ToString(), "驗證出現錯誤，借貸方為必填項目..");

            if (entrys.Any(item => item.Amount == 0))
                validResult.ErrorMessages.Add(Guid.NewGuid().ToString(), "驗證出現錯誤，金額欄位不得為零..");

            if (entrys.Where(item => item.Type == Domain.Enum.EntryType.Debits).Sum(item => item.Amount) !=
                entrys.Where(item => item.Type == Domain.Enum.EntryType.Credits).Sum(item => item.Amount))
                validResult.ErrorMessages.Add(Guid.NewGuid().ToString(), "驗證出現錯誤，借貸金額不平衡..");

            var accountingSubjectCodes = detail.Entrys.Select(item => item.AccountingSubjectCode).ToArray();
            var accountingSubjects = this.accountingSubjectRepository.FetchBy(accountingSubjectCodes);
            foreach (var entry in entrys)
            {
                var accountingSubject = accountingSubjects.FirstOrDefault(item => item.Code == entry.AccountingSubjectCode);
                if (accountingSubject == null)
                    validResult.ErrorMessages.Add(Guid.NewGuid().ToString(), string.Format("驗證出現錯誤，會計科目({0})不存在..", entry.AccountingSubjectCode));
            }
        }

        private void graphBy(
            AccountingSubjectType accountingSubjectType,
            DateTime tradingDayBegin,
            DateTime tradingDayEnd,
            IEnumerable<GraphEntry> graphEntry,
            IEnumerable<AccountingSubject> accountingSubjects,
            Dictionary<AccountingSubjectType, IList<dynamic>> dictionary)
        {
            var accountingSubjectCodes = accountingSubjects.Where(item => item.Type == accountingSubjectType).Select(item => item.Code);

            var totalDebitAmount = graphEntry.Where(item =>
                item.Entry.Type == EntryType.Debits &&
                accountingSubjectCodes.Any(ii => item.Entry.AccountingSubjectCode.Contains(ii)) &&
                item.TradingDay >= tradingDayBegin &&
                item.TradingDay < tradingDayEnd).Sum(item => item.Entry.Amount);

            var totalCreditAmount = graphEntry.Where(item =>
                item.Entry.Type == EntryType.Credits &&
                accountingSubjectCodes.Any(ii => item.Entry.AccountingSubjectCode.Contains(ii)) &&
                item.TradingDay >= tradingDayBegin &&
                item.TradingDay < tradingDayEnd).Sum(item => item.Entry.Amount);

            dictionary[accountingSubjectType].Add(new { date = tradingDayEnd, value = totalDebitAmount - totalCreditAmount });
        }

        #endregion
    }
}
