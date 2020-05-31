using System;
using System.Runtime.Serialization;
using AccountingSystem.Domain.Enum;

namespace AccountingSystem.Domain
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
        public AccountingSubjectType Type { get; set; }

        /// <summary>
        /// 代碼
        /// </summary>
        [DataMember]
        public string Code { get; set; }

        /// <summary>
        /// 名稱
        /// </summary>
        [DataMember]
        public string Name { get; set; }

        /// <summary>
        /// 描述
        /// </summary>
        [DataMember]
        public string Description { get; set; }

        #region Public

        public bool IsEmptyInstance()
        {
            return
                string.IsNullOrEmpty(this.Code) &&
                string.IsNullOrEmpty(this.Name) &&
                string.IsNullOrEmpty(this.Description);
        }

        #endregion
    }
}
