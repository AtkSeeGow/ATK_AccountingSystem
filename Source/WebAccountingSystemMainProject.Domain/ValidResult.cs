using System.Collections.Generic;
using System.Runtime.Serialization;

namespace WebAccountingSystemMainProject.Domain
{
    /// <summary>
    /// 驗證結果
    /// </summary>
    [DataContract]
    public class ValidResult
    {
        /// <summary>
        /// 是否驗證通過
        /// </summary>
        public bool IsValid
        {
            get
            {
                isValid = this.ErrorMessages.Count == 0;
                return isValid;
            }
        }

        [DataMember]
        public bool isValid;

        /// <summary>
        /// 驗證錯誤訊息
        /// </summary>
        public Dictionary<string, string> ErrorMessages
        {
            get
            {
                if (errorMessages == null)
                    this.errorMessages = new Dictionary<string, string>();
                return this.errorMessages;
            }
        }

        [DataMember]
        private Dictionary<string, string> errorMessages;

        [OnSerializing]
        private void OnSerializing(StreamingContext context)
        {
            var x = this.IsValid;
            var y = this.ErrorMessages;
        }
    }

}
