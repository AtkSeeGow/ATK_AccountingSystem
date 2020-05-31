using Microsoft.AspNetCore.Mvc;

namespace AccountingSystem.Web
{
    public class MaintenanceAccountingSubjectController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
