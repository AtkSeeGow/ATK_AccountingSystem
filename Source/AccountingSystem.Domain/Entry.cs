using System;
using System.Runtime.Serialization;
using AccountingSystem.Domain.Enum;

namespace AccountingSystem.Domain
{
    /// <summary>
    /// 分錄
    /// </summary>
    [DataContract]
    public class Entry : AbstractDomain
    {
        /// <summary>
        /// 分錄類型
        /// </summary>
        [DataMember]
        public EntryType Type { get; set; }

        /// <summary>
        /// 會計科目代碼
        /// </summary>
        [DataMember]
        public string AccountingSubjectCode { get; set; }

        /// <summary>
        /// 金額
        /// </summary>
        [DataMember]
        public double? Amount { get; set; }

        /// <summary>
        /// 摘要
        /// </summary>
        [DataMember]
        public string Summary { get; set; }

        #region Public

        #endregion
    }

    /// <summary>
    /// 
    /// </summary>
    public class GraphEntry
    {
        /// <summary>
        /// 
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// 交易日
        /// </summary>
        public DateTime TradingDay { get; set; }

        /// <summary>
        /// 
        /// </summary>
        public Entry Entry { get; set; }
    }
}
