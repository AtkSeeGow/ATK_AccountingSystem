using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WebAccountingSystemMainProject.Service;

namespace WebAccountingSystemMainProject.Web
{
    [AllowAnonymous]
    public class LoginController : Controller
    {
        private readonly AuthorizationService authorizationService;

        public LoginController(AuthorizationService authorizationService)
        {
            this.authorizationService = authorizationService;
        }

        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public ActionResult GenerateToken([FromBody]dynamic userInformation)
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
    }

}
