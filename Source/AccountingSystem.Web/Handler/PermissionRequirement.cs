using Microsoft.AspNetCore.Authorization;

namespace AccountingSystem.Web.Handler
{
    public class PermissionRequirement : IAuthorizationRequirement
    {
        public PermissionRequirement()
        {
        }
    }
}
