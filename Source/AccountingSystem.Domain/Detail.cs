using System;
using System.Collections.Generic;
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

        #region Public

        #endregion
    }
}
