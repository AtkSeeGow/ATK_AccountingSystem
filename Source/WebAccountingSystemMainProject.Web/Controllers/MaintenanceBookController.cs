using Microsoft.AspNetCore.Mvc;

namespace WebAccountingSystemMainProject.Web
{
    public class MaintenanceBookController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}