using Microsoft.AspNetCore.Mvc;

namespace AccountingSystem.Web
{
    public class GeneralJournalController : Controller
    {
        public GeneralJournalController()
        {
        }

        public IActionResult Index()
        {
            return View();
        }
    }
}
