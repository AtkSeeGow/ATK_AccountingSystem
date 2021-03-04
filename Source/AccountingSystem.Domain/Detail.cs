using AccountingSystem.Domain.Enum;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Globalization;
using System.Linq;
using System.Runtime.Serialization;

namespace AccountingSystem.Domain
{
    /// <summary>
    /// 明細(交易)
    /// </summary>
    [DataContract]
    public class Detail : AbstractDomain
    {
        public Detail()
        {
            this.Entrys = new List<Entry>();
        }

        /// <summary>
        /// 名稱
        /// </summary>
        [DataMember]
        public string Name { get; set; }

        /// <summary>
        /// 交易日
        /// </summary>
        [DataMember]
        public DateTime? TradingDay { get; set; }

        /// <summary>
        /// 記錄人
        /// </summary>
        [DataMember]
        public string Recorder { get; set; }

        /// <summary>
        /// 分錄
        /// </summary>
        [DataMember]
        public IList<Entry> Entrys { get; set; }

        /// <summary>
        /// 包裝資訊(多筆匯入檔案資)
        /// </summary>
        [DataMember]
        public PackageInformation PackageInformation { get; set; }

        #region Public

        /// <summary>
        /// 
        /// </summary>
        /// <param name="fields"></param>
        /// <param name="accountingSubjectCode"></param>
        /// <returns></returns>
        public static Detail CreateInstance(Condition condition, string[] fields, IEnumerable<AccountingSubject> accountingSubjects)
        {
            var dictionary = new Dictionary<string, IList<string>>();
            foreach(var accountingSubject in accountingSubjects)
                if(!dictionary.ContainsKey(accountingSubject.Code))
                    dictionary.Add(accountingSubject.Code, accountingSubject.Description.Split(',').Select(item => item.Trim()).ToList());

            fields[2] = fields[2].Trim();
            fields[4] = fields[4].Trim();
            fields[5] = fields[5].Trim();
            fields[6] = fields[6].Trim();

            var detail = new Detail();

            var entryType = string.IsNullOrEmpty(fields[2]) ? EntryType.Credits : EntryType.Debits;
            var amount = double.Parse(entryType == EntryType.Debits ? fields[2] : fields[1]);
            var summary = $"{fields[4]},{fields[5]},{fields[6]}";

            detail.Name = condition.Name;
            detail.TradingDay = DateTime.ParseExact(fields[0], "yyyyMMdd", CultureInfo.InvariantCulture);

            detail.Entrys.Add(new Entry() { 
                Amount = amount, 
                AccountingSubjectCode = string.Join(',', accountingSubjects.Where(item => item.Code == condition.AccountingSubjectCode).Select(item => $"{item.Code}({item.Name})")),
                Type = entryType, 
                Summary = summary });
            detail.Entrys.Add(new Entry() {
                Amount = amount,
                AccountingSubjectCode = string.Join(',', dictionary.Where(item =>
                    (!string.IsNullOrEmpty(fields[4]) && (item.Value.Contains(fields[4]))) ||
                    (!string.IsNullOrEmpty(fields[5]) && (item.Value.Contains(fields[5]))) ||
                    (!string.IsNullOrEmpty(fields[6]) && (item.Value.Contains(fields[6])))).Select(item => 
                        $"{item.Key}({accountingSubjects.FirstOrDefault(ii => ii.Code == item.Key).Name})")), 
                Type = entryType == EntryType.Debits ? EntryType.Credits: EntryType.Debits, 
                Summary = summary });
            detail.Entrys = detail.Entrys.OrderBy(item => item.Type).ToList();

            return detail;
        }

        #endregion
    }
}
