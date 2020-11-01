using Microsoft.AspNetCore.Mvc;
using AccountingSystem.Repository;

namespace AccountingSystem.Web
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
