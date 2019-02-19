using System;
using System.Runtime.Serialization;

namespace WebAccountingSystemMainProject.Domain
{
    [DataContract]
    public class EntryForCondition : Entry
    {
        /// <summary>
        /// 交易起日
        /// </summary>
        [DataMember]
        public DateTime? EntryTradingDayBegin { get; set; }

        /// <summary>
        /// 交易迄日
        /// </summary>
        [DataMember]
        public DateTime? EntryTradingDayEnd { get; set; }
    }
}
