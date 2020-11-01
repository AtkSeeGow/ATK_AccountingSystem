using Microsoft.AspNetCore.Mvc;

namespace AccountingSystem.Web
{
    public class IncomeStatementController : Controller
    {
        public IncomeStatementController()
        {
        }

        public IActionResult Index()
        {
            return View();
        }
    }
}
