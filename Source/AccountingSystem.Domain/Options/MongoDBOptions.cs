namespace AccountingSystem.Domain.Options
{
    public class MongoDBOptions
    {
        public string ConnectionString { get; set; }
        public string CollectionName { get; set; }
    }

    public class LocalMongoDBOptions : MongoDBOptions
    {
    }

    public class RemoteMongoDBOptions : MongoDBOptions
    {
    }
}