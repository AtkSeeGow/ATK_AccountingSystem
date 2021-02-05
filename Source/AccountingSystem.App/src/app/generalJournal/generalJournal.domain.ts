import * as Handsontable from 'handsontable';

import { AutocompleteModel, Dictionary } from '../common/autocomplete/autocomplete.model'
import { AccountingSubject } from '../common/accountingSubject.component'
import { StringUtility } from '../common/utility.component'
import { HttpErrorHandler } from '../common/httpErrorHandler.component';

export class GeneralJournalUtility {
  static GetGridSettings(component: any): Handsontable.default.GridSettings {
    return {
      colHeaders: true,
      rowHeaders: true,
      minSpareCols: 1,
      minSpareRows: 1,
      autoWrapRow: true,
      columns: [
        {
          data: "type",
          title: "借/貸",
          type: 'dropdown',
          source: ['Debits', 'Credits']
        },
        {
          data: "accountingSubjectCode",
          title: "科目",
          type: 'autocomplete',
          source: function (query: any, process: any) {
            component.generalJournalService.asyncAutocompleteAccountingSubject(query).subscribe(function (httpResponse: any) {
              const result: string[] = [];
              httpResponse.forEach(function (value: AccountingSubject) {
                result.push(value.code + '(' + value.name + ')');
              });
              process(result);
            }, function (httpErrorResponse: any) { HttpErrorHandler.Notify(httpErrorResponse); });
          },
          strict: false,
          width: 300
        },
        {
          data: "amount",
          title: "金額",
          type: 'numeric',
          numericFormat: {
            pattern: '$0,0.00',
            culture: 'zh-TW'
          }
        },
        {
          data: "summary",
          title: "摘要"
        }],
      stretchH: 'last'
    };
  }

  static GetAccountingSubjectAutocompleteModel(component: any): AutocompleteModel {
    const autocompleteModel = new AutocompleteModel();

    autocompleteModel.onValueChanged = function (value: string): string {
      component.conditionForView.accountingSubjectCode = value;
      component.generalJournalService.asyncAutocompleteAccountingSubject(StringUtility.SelectLastValue(value)).subscribe(function (httpResponse: any) {
        const result = new Dictionary();
        httpResponse.forEach(function (value: AccountingSubject) {
          result[value.code] = value.code + '(' + value.name + ')'
        });
        autocompleteModel.menu = result;
        autocompleteModel.displayMenu();
      }, function (httpErrorResponse: any) { HttpErrorHandler.Notify(httpErrorResponse); });
      return value;
    };

    autocompleteModel.onExternalSelected = function (item: any) {
      component.conditionForView.accountingSubjectCode = autocompleteModel.inputValue = StringUtility.SeparationSymbolMerge(autocompleteModel.inputValue, item);
    }

    return autocompleteModel
  }

  static GetBookNameAutocompleteModel(component: any): AutocompleteModel {
    const autocompleteModel = new AutocompleteModel();

    autocompleteModel.onValueChanged = function (value: string): string {
      component.conditionForView.name = value;
      component.generalJournalService.asyncSelectBookNameBy(StringUtility.SelectLastValue(value)).subscribe(function (httpResponse: any) {
        const result = new Dictionary();
        httpResponse.forEach(function (value: string) {
          result[value] = value;
        });
        autocompleteModel.menu = result;
        autocompleteModel.displayMenu();
      }, function (httpErrorResponse: any) { HttpErrorHandler.Notify(httpErrorResponse); });
      return value;
    };

    autocompleteModel.onExternalSelected = function (item: any) {
      component.conditionForView.name = autocompleteModel.inputValue = StringUtility.SeparationSymbolMerge(autocompleteModel.inputValue, item);
    }

    return autocompleteModel;
  }
}
