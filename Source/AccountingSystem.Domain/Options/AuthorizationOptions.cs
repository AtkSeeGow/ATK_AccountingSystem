namespace AccountingSystem.Domain.Options
{
    public class AuthorizationOptions
    {
        public bool IsUseActiveDirectory { get; set; }
        public int ActiveDirectoryContextType { get; set; }
        public string ActiveDirectoryName { get; set; }
        public string ActiveDirectoryUserName { get; set; }
        public string ActiveDirectoryPassword { get; set; }
        public bool IsUseRSAEncoder { get; set; }
    }
}