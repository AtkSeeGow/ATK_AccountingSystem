using AccountingSystem.Domain;
using AccountingSystem.Domain.Enum;
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
        public IEnumerable<Detail> FetchBy([FromBody] Condition condition)
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
                foreach (var entry in detail.Entrys)
                {
                    var accountingSubject = accountingSubjects.FirstOrDefault(item => item.Code == entry.AccountingSubjectCode);
                    if (accountingSubject != null)
                        entry.AccountingSubjectCode = string.Format("{0}({1})", accountingSubject.Code, accountingSubject.Name);
                }
            }

            return details;
        }

        [HttpPost]
        public ActionResult SaveBy([FromBody] Detail detail)
        {
            var details = new Detail[] { detail };
            var validResult = this.savesBy(details);

            if (!validResult.IsValid)
                return BadRequest(validResult);
            else
                return Ok(validResult);
        }

        [HttpPost]
        public ActionResult SavesBy([FromBody] IEnumerable<Detail> details)
        {
            var validResult = this.savesBy(details);

            if (!validResult.IsValid)
                return BadRequest(validResult);
            else
                return Ok(validResult);
        }

        [HttpPost]
        public ActionResult DeleteBy([FromBody] dynamic target)
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

        /// <summary>
        /// 分類帳
        /// </summary>
        /// <param name="condition"></param>
        /// <returns></returns>
        [HttpPost]
        public Dictionary<string, dynamic> LedgerBy([FromBody] Condition condition)
        {
            condition.Recorder = HttpContext.User.Claims.FirstOrDefault(p => p.Type == ClaimTypes.Name).Value;

            if (condition.TradingDayBegin.HasValue)
                condition.TradingDayBegin = condition.TradingDayBegin.Value.ToLocalTime();

            if (condition.TradingDayEnd.HasValue)
                condition.TradingDayEnd = condition.TradingDayEnd.Value.ToLocalTime().AddDays(1).AddMilliseconds(-1);

            var accountingSubjects = this.accountingSubjectRepository.FetchAll().Result;

            var ledgers = new Dictionary<AccountingSubject, IList<GraphEntry>>();

            var details = this.detailRepository.FetchBy(condition);
            foreach (var detail in details)
            {
                foreach (var entry in detail.Entrys)
                {
                    // 過濾收入總計與費用總計科目
                    if (entry.AccountingSubjectCode == "400000" || entry.AccountingSubjectCode == "500000")
                        continue;

                    var accountingSubject = accountingSubjects.FirstOrDefault(item => item.Code == entry.AccountingSubjectCode);
                    if (accountingSubject == null)
                        accountingSubject = new AccountingSubject() { Code = entry.AccountingSubjectCode, Type = AccountingSubjectType.None };

                    if (!ledgers.ContainsKey(accountingSubject))
                        ledgers.Add(accountingSubject, new List<GraphEntry>());

                    ledgers[accountingSubject].Add(new GraphEntry() { TradingDay = detail.TradingDay.Value, Name = detail.Name, Entry = entry });
                }
            }

            foreach (var keyValuePair in ledgers)
            {
                var graphEntrys = keyValuePair.Value.OrderBy(item => item.TradingDay).ToList();
                keyValuePair.Value.Clear();
                foreach (var graphEntry in graphEntrys)
                    keyValuePair.Value.Add(graphEntry);
            }

            var groups = new List<KeyValuePair<string, double>>();

            // 實帳號為累積制，故計算時不由零開始
            var keyValuePairs = detailRepository.GroupBy(null, condition.TradingDayBegin.Value.AddMilliseconds(-1));

            foreach (var keyValuePair in keyValuePairs)
            {
                var accountingSubject = accountingSubjects.FirstOrDefault(item => item.Code == keyValuePair.Key);

                if (accountingSubject == null)
                    continue;

                if (accountingSubject.Type == AccountingSubjectType.Assets ||
                    accountingSubject.Type == AccountingSubjectType.Liabilities ||
                    accountingSubject.Type == AccountingSubjectType.OwnerEquity)
                {
                    groups.Add(keyValuePair);

                    if (!ledgers.ContainsKey(accountingSubject))
                        ledgers.Add(accountingSubject, new List<GraphEntry>());
                }
            }

            var result = new Dictionary<string, dynamic>();
            result.Add("ledgers", ledgers.OrderBy(item => item.Key.Type).ThenBy(item => item.Key.Code).ToList());
            result.Add("groups", groups);

            return result;
        }

        /// <summary>
        /// 資產負債表
        /// </summary>
        /// <param name="condition"></param>
        /// <returns></returns>
        [HttpPost]
        public List<KeyValuePair<AccountingSubject, double>> TotalBy([FromBody] Condition condition)
        {
            var accountingSubjects = this.accountingSubjectRepository.FetchAll().Result;

            condition.Recorder = HttpContext.User.Claims.FirstOrDefault(p => p.Type == ClaimTypes.Name).Value;

            if (condition.TradingDayBegin.HasValue)
                condition.TradingDayBegin = condition.TradingDayBegin.Value.ToLocalTime();

            if (condition.TradingDayEnd.HasValue)
                condition.TradingDayEnd = condition.TradingDayEnd.Value.ToLocalTime().AddDays(1).AddMilliseconds(-1);

            var result = new List<KeyValuePair<AccountingSubject, double>>();
            var keyValuePairs = detailRepository.GroupBy(condition.TradingDayBegin, condition.TradingDayEnd);
            foreach (var keyValuePair in keyValuePairs)
            {
                var accountingSubject = accountingSubjects.FirstOrDefault(item => item.Code == keyValuePair.Key);
                if (accountingSubject == null)
                    continue;

                if (keyValuePair.Value == 0)
                    continue;

                result.Add(new KeyValuePair<AccountingSubject, double>(accountingSubject, keyValuePair.Value));
            }

            var assetsTotal = result.Where(item => item.Key.Type == AccountingSubjectType.Assets).Sum(item => item.Value);
            var liabilitiesTotal = result.Where(item => item.Key.Type == AccountingSubjectType.Liabilities).Sum(item => item.Value);
            var ownerEquityTotal = result.Where(item => item.Key.Type == AccountingSubjectType.OwnerEquity).Sum(item => item.Value);
            var balanceTotal = (assetsTotal + liabilitiesTotal + ownerEquityTotal) * -1;
            result.Add(new KeyValuePair<AccountingSubject, double>(new AccountingSubject() { Type = AccountingSubjectType.OwnerEquity, Name = "保留盈餘", Code = "9999999" }, balanceTotal));

            result = result.OrderBy(item => item.Key.Code).ToList();
            return result;
        }

        /// <summary>
        /// 損益表
        /// </summary>
        /// <param name="condition"></param>
        /// <returns></returns>
        [HttpPost]
        public dynamic SumBy([FromBody] Condition condition)
        {
            var accountingSubjects = this.accountingSubjectRepository.FetchAll().Result;

            condition.Recorder = HttpContext.User.Claims.FirstOrDefault(p => p.Type == ClaimTypes.Name).Value;

            if (condition.TradingDayBegin.HasValue)
                condition.TradingDayBegin = condition.TradingDayBegin.Value.ToLocalTime();

            if (condition.TradingDayEnd.HasValue)
                condition.TradingDayEnd = condition.TradingDayEnd.Value.ToLocalTime().AddDays(1).AddMilliseconds(-1);

            var keys = new HashSet<string>();

            var target = new List<KeyValuePair<AccountingSubject, List<KeyValuePair<string, double>>>>();

            var tradingDayBegin = new DateTime(condition.TradingDayBegin.Value.Year, condition.TradingDayBegin.Value.Month, 1);
            while (tradingDayBegin <= condition.TradingDayEnd.Value)
            {
                var key = tradingDayBegin.ToString("yyyy/MM");
                keys.Add(key);

                var tradingDayEnd = tradingDayBegin.AddMonths(condition.MonthInterval).AddSeconds(-1);

                var keyValuePairs = detailRepository.GroupBy(tradingDayBegin, tradingDayEnd);
                foreach (var keyValuePair in keyValuePairs)
                {
                    var accountingSubjectCode = keyValuePair.Key;
                    var amount = keyValuePair.Value;

                    if (amount == 0)
                        continue;

                    var accountingSubject = accountingSubjects.FirstOrDefault(item => item.Code == accountingSubjectCode);

                    if (!target.Any(item => item.Key.Code == accountingSubjectCode))
                        target.Add(new KeyValuePair<AccountingSubject, List<KeyValuePair<string, double>>>(accountingSubject, new List<KeyValuePair<string, double>>()));

                    var keyAmountPair = target.FirstOrDefault(item => item.Key.Code == accountingSubjectCode);
                    keyAmountPair.Value.Add(new KeyValuePair<string, double>(key, amount));
                }

                tradingDayBegin = tradingDayEnd.AddSeconds(1);
            }

            target = target.OrderBy(item => item.Key.Code).ToList();
            return new { keys, target };
        } 

        [HttpPost]
        public Dictionary<AccountingSubjectType, IList<dynamic>> GraphBy([FromBody] Condition condition)
        {
            if (condition.TradingDayBegin.HasValue)
                condition.TradingDayBegin = condition.TradingDayBegin.Value.ToLocalTime();

            if (condition.TradingDayEnd.HasValue)
                condition.TradingDayEnd = condition.TradingDayEnd.Value.ToLocalTime().AddDays(1).AddMilliseconds(-1);

            var details = this.detailRepository.FetchBy(condition);

            var accountingSubjects = accountingSubjectRepository.FetchAll().Result;

            var graphEntrys = new List<GraphEntry>();
            foreach (var detail in details)
                foreach (var entry in detail.Entrys)
                    if (string.IsNullOrEmpty(condition.AccountingSubjectCode) ||
                        condition.AccountingSubjectCode.Contains(entry.AccountingSubjectCode))
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

        private ValidResult savesBy(IEnumerable<Detail> details)
        {
            var packageInformation = PackageInformation.CreateInstance(string.Empty);
            packageInformation.Id = Guid.NewGuid();
            packageInformation.IsReadComplate = true;

            var validResult = new ValidResult();

            foreach (var detail in details)
            {
                detail.Recorder = HttpContext.User.Claims.FirstOrDefault(p => p.Type == ClaimTypes.Name).Value;
                detail.PackageInformation = packageInformation;
                this.validBy(validResult, detail);
            }

            if (!validResult.IsValid)
                return validResult;

            try
            {
                foreach (var detail in details)
                {
                    if (detailRepository.Exist(detail.Id))
                        detailRepository.Update(detail);
                    else
                        detailRepository.Create(detail).Wait();
                }
            }
            catch (Exception exception)
            {
                logger.LogError(JsonConvert.SerializeObject(details));
                throw exception;
            }

            return validResult;
        }

        private void validBy(ValidResult validResult, Detail detail)
        {
            var entrys = detail.Entrys;

            if (!detail.TradingDay.HasValue)
                validResult.ErrorMessages.Add(Guid.NewGuid().ToString(), "交易日為必填欄位..");

            if (entrys.Any(item => item.Type == Domain.Enum.EntryType.None))
                validResult.ErrorMessages.Add(Guid.NewGuid().ToString(), $"驗證出現錯誤({detail.TradingDay})，借貸方為必填項目..");

            if (entrys.Any(item => item.Amount == 0))
                validResult.ErrorMessages.Add(Guid.NewGuid().ToString(), $"驗證出現錯誤({detail.TradingDay})，金額欄位不得為零..");

            if (entrys.Where(item => item.Type == Domain.Enum.EntryType.Debits).Sum(item => item.Amount) !=
                entrys.Where(item => item.Type == Domain.Enum.EntryType.Credits).Sum(item => item.Amount))
                validResult.ErrorMessages.Add(Guid.NewGuid().ToString(), $"驗證出現錯誤({detail.TradingDay})，借貸金額不平衡..");

            var accountingSubjectCodes = detail.Entrys.Select(item => item.AccountingSubjectCode).ToArray();
            var accountingSubjects = this.accountingSubjectRepository.FetchBy(accountingSubjectCodes);
            foreach (var entry in entrys)
            {
                var accountingSubject = accountingSubjects.FirstOrDefault(item => item.Code == entry.AccountingSubjectCode);
                if (accountingSubject == null)
                    validResult.ErrorMessages.Add(Guid.NewGuid().ToString(), $"驗證出現錯誤({detail.TradingDay})，會計科目({entry.AccountingSubjectCode})不存在..");
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
