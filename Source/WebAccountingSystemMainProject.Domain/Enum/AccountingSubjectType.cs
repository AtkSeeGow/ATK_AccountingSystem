using System;
using System.Runtime.Serialization;

namespace WebAccountingSystemMainProject.Domain.Enum
{
    /// <summary>
    /// 科目科目類型
    /// </summary>
    public enum AccountingSubjectType
    {
        /// <summary>
        /// 無
        /// </summary>
        None,
        /// <summary>
        /// 資產
        /// </summary>
        Assets,
        /// <summary>
        /// 負債
        /// </summary>
        Liabilities,
        /// <summary>
        /// 業主權益
        /// </summary>
        OwnerEquity,
        /// <summary>
        /// 收入
        /// </summary>
        Revenues,
        /// <summary>
        /// 費用
        /// </summary>
        Expenses
    }
}
