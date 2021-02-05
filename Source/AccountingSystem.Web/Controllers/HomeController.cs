using Microsoft.AspNetCore.Mvc;

namespace AccountingSystem.Web
{
    public class HomeController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}