using System.Runtime.Serialization;

namespace AccountingSystem.Domain
{
    /// <summary>
    /// 日記簿
    /// </summary>
    [DataContract]
    public class Book : AbstractDomain
    {
        /// <summary>
        /// 日記簿名稱
        /// </summary>
        [DataMember]
        public string Name { get; set; }

        /// <summary>
        /// 讀取人
        /// </summary>
        [DataMember]
        public string Reader { get; set; }

        /// <summary>
        /// 記錄人
        /// </summary>
        [DataMember]
        public string Recorder { get; set; }

        #region Public

        public bool IsEmptyInstance()
        {
            return
                string.IsNullOrEmpty(this.Name) &&
                string.IsNullOrEmpty(this.Reader);
        }

        #endregion
    }
}
