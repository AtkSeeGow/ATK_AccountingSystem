using System;
using System.Runtime.Serialization;

namespace WebAccountingSystemMainProject.Domain.Options
{
    public class MongoDBOptions
    {
        public string ConnectionString { get; set; }
        public string CollectionName { get; set; }
    }
}