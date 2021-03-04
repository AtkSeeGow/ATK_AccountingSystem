using System;
using System.IO;
using System.Runtime.Serialization;

namespace AccountingSystem.Domain
{
    /// <summary>
    /// 封包資訊
    /// </summary>
    [DataContract]
    public class PackageInformation : AbstractDomain
    {
        public static PackageInformation CreateInstance(string localZipFilePath)
        {
            var result = new PackageInformation();

            result.PackageName = Path.GetFileName(localZipFilePath);
            result.CreateDate = DateTime.Now;

            return result;
        }

        #region Property

        /// <summary>
        /// 封包名稱(壓縮檔檔名)
        /// </summary>
        [DataMember]
        public string PackageName { get; set; }

        /// <summary>
        /// 讀檔時間
        /// </summary>
        [DataMember]
        public DateTime CreateDate { get; set; }

        /// <summary>
        /// 狀態
        /// </summary>
        [DataMember]
        public bool IsReadComplate { get; set; }

        #endregion

        #region Public
        
        #endregion
    }
}
