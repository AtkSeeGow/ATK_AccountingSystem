using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using AccountingSystem.Service;

namespace AccountingSystem.Web.Api
{
    [Route("Api/[controller]/[action]")]
    [ApiController]
    public class AuthenticationController : Controller
    {
        private readonly AuthorizationService authorizationService;

        public AuthenticationController(AuthorizationService authorizationService)
        {
            this.authorizationService = authorizationService;
        }

        [HttpPost]
        [AllowAnonymous]
        public ActionResult GenerateToken([FromBody] dynamic userInformation)
        {
            var account = userInformation.account != null ? (string)userInformation.account : string.Empty;
            var password = userInformation.password != null ? (string)userInformation.password : string.Empty;
            if (string.IsNullOrEmpty(account) || string.IsNullOrEmpty(password))
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = "使用者名稱或密碼不能為空白" });

            var validateCredentialsResult = this.authorizationService.ValidateCredentials(account, password);

            if (!validateCredentialsResult)
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = "使用者名稱或密碼錯誤" });

            var token = this.authorizationService.GenerateToken(account);
            Response.Cookies.Append("Authorization", token);

            var result = new { token = token };
            return Ok(result);
        }

        [HttpPost]
        public ActionResult CanActivate([FromBody] dynamic functionKeys)
        {
            return Ok(true);
        }
    }
}
