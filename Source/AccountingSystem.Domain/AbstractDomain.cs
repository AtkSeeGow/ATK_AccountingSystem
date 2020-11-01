using System;
using System.Runtime.Serialization;
using AccountingSystem.Domain.Interface;

namespace AccountingSystem.Domain
{
    [DataContract]
    public partial class AbstractDomain : IIdentifier<Guid>
    {
        [DataMember]
        public Guid Id { get; set; }
    }
}
