using WebAccountingSystemMainProject.Domain;
using WebAccountingSystemMainProject.Domain.Options;
using WebAccountingSystemMainProject.Repository;
using Xunit;

namespace WebAccountingSystemMainProject.Test
{
    public class AuthorizationRepositoryTest
    {
        private readonly AuthorizationRepository authorizationRepository;

        private readonly MongoDBOptions mongoDBOptions = new MongoDBOptions()
        {
            ConnectionString = "mongodb://Ubuntu-1804.mshome.net:27017/",
            CollectionName = "ATK_AccountingSystem"
        };

        public AuthorizationRepositoryTest()
        {
            this.authorizationRepository = new AuthorizationRepository(this.mongoDBOptions);
        }

        [Fact]
        public void Create()
        {
            var authorization = new Authorization()
            {
                Account = "root",
                Password = "1qaz@WSX"
            };
            this.authorizationRepository.Create(authorization).Wait();
        }
    }
}
