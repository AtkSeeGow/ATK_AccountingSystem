using System;
using System.Runtime.Serialization;
using WebAccountingSystemMainProject.Domain.Interface;

namespace WebAccountingSystemMainProject.Domain
{
    [DataContract]
    public partial class AbstractDomain : IIdentifier<Guid>
    {
        [DataMember]
        public Guid Id { get; set; }
    }
}
