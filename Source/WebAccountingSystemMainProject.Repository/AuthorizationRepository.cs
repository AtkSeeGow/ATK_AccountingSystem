using System;
using WebAccountingSystemMainProject.Domain;
using WebAccountingSystemMainProject.Domain.Options;

namespace WebAccountingSystemMainProject.Repository
{
    public class AuthorizationRepository : GenericRepository<Authorization, Guid>
    {
        public AuthorizationRepository(MongoDBOptions mongoDBOptions) : base(mongoDBOptions)
        {
        }
    }
}