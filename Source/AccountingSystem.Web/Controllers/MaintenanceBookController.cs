using Microsoft.AspNetCore.Mvc;

namespace AccountingSystem.Web
{
    public class MaintenanceBookController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}