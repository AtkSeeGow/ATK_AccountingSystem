using Microsoft.AspNetCore.Mvc;
using WebAccountingSystemMainProject.Repository;

namespace WebAccountingSystemMainProject.Web
{
    public class GeneralLedgerController : Controller
    {
        public GeneralLedgerController()
        {
        }

        public IActionResult Index()
        {
            return View();
        }
    }
}
