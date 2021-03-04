using System;

namespace AccountingSystem.Domain.Interface
{
    public interface IIdentifier<TIdType> where TIdType : IEquatable<TIdType>
    {
        TIdType Id
        {
            get;
        }
    }
}