using Microsoft.AspNetCore.Mvc;
using WebAccountingSystemMainProject.Repository;

namespace WebAccountingSystemMainProject.Web
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
