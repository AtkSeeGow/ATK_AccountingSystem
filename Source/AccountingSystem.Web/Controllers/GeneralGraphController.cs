using Microsoft.AspNetCore.Mvc;

namespace AccountingSystem.Web
{
    public class GeneralGraphController : Controller
    {
        public GeneralGraphController()
        {
        }

        public IActionResult Index()
        {
            return View();
        }
    }
}
