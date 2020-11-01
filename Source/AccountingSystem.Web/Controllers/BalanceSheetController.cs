using Microsoft.AspNetCore.Mvc;

namespace AccountingSystem.Web
{
    public class BalanceSheetController : Controller
    {
        public BalanceSheetController()
        {
        }

        public IActionResult Index()
        {
            return View();
        }
    }
}
