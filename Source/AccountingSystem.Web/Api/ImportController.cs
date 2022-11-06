using AccountingSystem.Domain;
using AccountingSystem.Repository;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.IO;
using System.Linq;

namespace AccountingSystem.Web.Api
{
    [Route("Api/[controller]/[action]")]
    [Authorize(AuthenticationSchemes = "PermissionHandler")]
    public class ImportController : Controller
    {
        private readonly AccountingSubjectRepository accountingSubjectRepository;

        public ImportController(AccountingSubjectRepository accountingSubjectRepository)
        {
            this.accountingSubjectRepository = accountingSubjectRepository;
        }

        public IActionResult UploadBy(IEnumerable<IFormFile> files)
        {
            var accountingSubjects = this.accountingSubjectRepository.FetchAll().Result;

            var condition = Condition.CreateInstance(Request.Form.Keys.ToDictionary(k => k, v => Request.Form[v].ToString()));

            var details = new List<Detail>();
            foreach (var file in files)
            {
                if (file.Length > 0)
                {
                    using (var streamReader = new StreamReader(file.OpenReadStream(), System.Text.Encoding.UTF8))
                    {
                        while (!streamReader.EndOfStream)
                        {
                            var readLine = streamReader.ReadLine();
                            if (string.IsNullOrEmpty(readLine))
                                continue;

                            var fields = readLine.Split(',');

                            details.Add(Detail.CreateInstance(condition, fields, accountingSubjects));
                        }
                    }
                }
            }

            var result = new Dictionary<string, IEnumerable<Detail>>();
            result.Add("conflictDetails", details.Where(item =>
                    item.Entrys.Any(ii =>
                        string.IsNullOrEmpty(ii.AccountingSubjectCode) ||
                        ii.AccountingSubjectCode.Contains(","))).ToList());
            result.Add("normalDetails", details.Where(item =>
                    !item.Entrys.Any(ii =>
                        string.IsNullOrEmpty(ii.AccountingSubjectCode) ||
                        ii.AccountingSubjectCode.Contains(","))).ToList());

            return Ok(result);
        }
    }
}
