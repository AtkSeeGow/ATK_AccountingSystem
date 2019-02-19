using System.Runtime.Serialization;

namespace WebAccountingSystemMainProject.Domain
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
        public string BookName { get; set; }

        /// <summary>
        /// 讀取人
        /// </summary>
        [DataMember]
        public string BookReader { get; set; }

        /// <summary>
        /// 記錄人
        /// </summary>
        [DataMember]
        public string BookRecorder { get; set; }

        #region Public

        public bool IsEmptyInstance()
        {
            return
                string.IsNullOrEmpty(this.BookName) &&
                string.IsNullOrEmpty(this.BookReader);
        }

        #endregion
    }
}
