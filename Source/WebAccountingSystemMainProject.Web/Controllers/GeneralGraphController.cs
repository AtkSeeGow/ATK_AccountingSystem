using Microsoft.AspNetCore.Mvc;

namespace WebAccountingSystemMainProject.Web
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
