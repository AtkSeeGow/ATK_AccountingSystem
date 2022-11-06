using AccountingSystem.Domain;
using AccountingSystem.Domain.Options;
using AccountingSystem.Repository;
using Xunit;

namespace AccountingSystem.Test
{
    public class AuthorizationRepositoryTest
    {
        private readonly AuthorizationRepository authorizationRepository;

        private readonly MongoDBOptions mongoDBOptions = new MongoDBOptions()
        {
            ConnectionString = "mongodb://localhost:27017/",
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
                Account = "account",
                Password = "password"
            };
            this.authorizationRepository.Create(authorization).Wait();
        }
    }
}
