using System;
using System.Collections.Generic;
using System.Runtime.Serialization;

namespace AccountingSystem.Domain
{
    [DataContract]
    public class Condition
    {
        /// <summary>
        /// 交易起日
        /// </summary>
        [DataMember]
        public DateTime? TradingDayBegin { get; set; }

        /// <summary>
        /// 交易迄日
        /// </summary>
        [DataMember]
        public DateTime? TradingDayEnd { get; set; }

        /// <summary>
        /// 名稱
        /// </summary>
        [DataMember]
        public string Name { get; set; }

        /// <summary>
        /// 會計科目
        /// </summary>
        [DataMember]
        public string AccountingSubjectCode { get; set; }

        /// <summary>
        /// 摘要
        /// </summary>
        [DataMember]
        public string Summary { get; set; }

        /// <summary>
        /// 月間距
        /// </summary>
        [DataMember]
        public int MonthInterval { get; set; }

        /// <summary>
        /// 使用者代號
        /// </summary>
        public string Recorder { get; set; }

        #region Public

        public static Condition CreateInstance(IDictionary<string, string> form)
        {
            var result = new Condition();

            if(form.ContainsKey("name"))
                result.Name = form["name"];

            if (form.ContainsKey("accountingSubjectCode"))
                result.AccountingSubjectCode = form["accountingSubjectCode"];

            return result;
        }

        #endregion
    }
}
