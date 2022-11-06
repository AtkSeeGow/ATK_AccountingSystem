using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Routing;
using Microsoft.Extensions.Primitives;
using System.Linq;
using System.Threading;
using AccountingSystem.Service;

namespace AccountingSystem.Web.Filters
{
    public class AuthorizationFilter : IAuthorizationFilter
    {
        private readonly AuthorizationService authorizationService;

        public AuthorizationFilter(AuthorizationService authorizationService)
        {
            this.authorizationService = authorizationService;
        }

        public void OnAuthorization(AuthorizationFilterContext authorizationFilterContext)
        {
            if (authorizationFilterContext.Filters.Any(item => item is IAllowAnonymousFilter)) return;

            var request = authorizationFilterContext.HttpContext.Request;

            string token;
            request.Cookies.TryGetValue(AuthorizationService.AuthorizationTokenKey, out token);

            if (string.IsNullOrEmpty(token))
            {
                request.Headers.TryGetValue(AuthorizationService.AuthorizationTokenKey, out StringValues stringValues);
                if (stringValues.Count > 0)
                    token = stringValues[0];
            }

            if (string.IsNullOrEmpty(token))
            {
                authorizationFilterContext.Result = new UnauthorizedResult();
                return;
            }

            try
            {
                var principal = authorizationService.ValidateToken(token);
                if (principal != null)
                {
                    authorizationFilterContext.HttpContext.User = principal;
                    Thread.CurrentPrincipal = principal;
                    return;
                }
                else
                {
                    authorizationFilterContext.Result = new UnauthorizedResult();
                    return;
                }
            }
            catch
            {
                authorizationFilterContext.Result = new UnauthorizedResult();
                return;
            }
        }
    }

}
