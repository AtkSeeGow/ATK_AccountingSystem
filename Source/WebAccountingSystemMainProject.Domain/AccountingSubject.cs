using System;
using System.Runtime.Serialization;
using WebAccountingSystemMainProject.Domain.Enum;

namespace WebAccountingSystemMainProject.Domain
{
    /// <summary>
    /// 會計科目
    /// </summary>
    [DataContract]
    public class AccountingSubject : AbstractDomain
    {
        /// <summary>
        /// 科目科目類型
        /// </summary>
        [DataMember]
        public AccountingSubjectType AccountingSubjectType { get; set; }

        /// <summary>
        /// 代碼
        /// </summary>
        [DataMember]
        public string AccountingSubjectCode { get; set; }

        /// <summary>
        /// 名稱
        /// </summary>
        [DataMember]
        public string AccountingSubjectName { get; set; }

        /// <summary>
        /// 描述
        /// </summary>
        [DataMember]
        public string AccountingSubjectDescription { get; set; }

        #region Public

        public bool IsEmptyInstance()
        {
            return
                string.IsNullOrEmpty(this.AccountingSubjectCode) &&
                string.IsNullOrEmpty(this.AccountingSubjectName) &&
                string.IsNullOrEmpty(this.AccountingSubjectDescription);
        }

        #endregion
    }
}
