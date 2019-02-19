using System;
using System.Runtime.Serialization;
using WebAccountingSystemMainProject.Domain.Enum;

namespace WebAccountingSystemMainProject.Domain
{
    /// <summary>
    /// 分錄
    /// </summary>
    [DataContract]
    public class Entry : AbstractDomain
    {
        /// <summary>
        /// 日記帳名稱
        /// </summary>
        [DataMember]
        public string EntryBookName { get; set; }

        /// <summary>
        /// 分錄類型
        /// </summary>
        [DataMember]
        public EntryType EntryType { get; set; }

        /// <summary>
        /// 交易日
        /// </summary>
        [DataMember]
        public DateTime? EntryTradingDay { get; set; }

        /// <summary>
        /// 會計科目
        /// </summary>
        [DataMember]
        public string EntryAccountingSubject { get; set; }

        /// <summary>
        /// 金額
        /// </summary>
        [DataMember]
        public double? EntryAmount { get; set; }

        /// <summary>
        /// 摘要
        /// </summary>
        [DataMember]
        public string EntrySummary { get; set; }

        /// <summary>
        /// 記錄人
        /// </summary>
        [DataMember]
        public string EntryRecorder { get; set; }

        #region Public

        public bool IsEmptyInstance()
        {
            return
                !this.EntryTradingDay.HasValue &&
                !this.EntryAmount.HasValue &&
                string.IsNullOrEmpty(this.EntryAccountingSubject);
        }

        #endregion
    }
}
