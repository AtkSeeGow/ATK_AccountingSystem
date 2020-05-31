using System;
using AccountingSystem.Domain;
using AccountingSystem.Domain.Options;

namespace AccountingSystem.Repository
{
    public class AuthorizationRepository : GenericRepository<Authorization, Guid>
    {
        public AuthorizationRepository(MongoDBOptions mongoDBOptions) : base(mongoDBOptions)
        {
        }
    }
}