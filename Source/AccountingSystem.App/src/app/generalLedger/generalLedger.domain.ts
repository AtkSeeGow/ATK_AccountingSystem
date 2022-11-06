import { AutocompleteModel, Dictionary } from '../common/autocomplete/autocomplete.model'
import { AccountingSubject, AccountingSubjectType } from '../common/accountingSubject.component'
import { StringUtility } from '../common/utility.component'
import { HttpErrorHandler } from '../common/httpErrorHandler.component'

import * as numeral from 'numeral';

export class GeneralLedgerUtility {
  static GetAccountingSubjectAutocompleteModel(component: any): AutocompleteModel {
    var autocompleteUtilityModel = new AutocompleteModel();

    autocompleteUtilityModel.onValueChanged = function (value: string): string {
      component.conditionForView.accountingSubjectCode = value;
      component.generalLedgerService.asyncAutocompleteAccountingSubject(StringUtility.SelectLastValue(value)).subscribe(function (httpResponse: any) {
        var result = new Dictionary();
        httpResponse.forEach(function (value: AccountingSubject, index: number, array: any[]) {
          result[value.code] = value.code + '(' + value.name + ')'
        });
        autocompleteUtilityModel.menu = result;
        autocompleteUtilityModel.displayMenu();
      }, function (httpErrorResponse: any) { HttpErrorHandler.Notify(httpErrorResponse); });
      return value;
    };

    autocompleteUtilityModel.onExternalSelected = function (item: any) {
      component.conditionForView.accountingSubjectCode = autocompleteUtilityModel.inputValue = StringUtility.SeparationSymbolMerge(autocompleteUtilityModel.inputValue, item);
    }

    return autocompleteUtilityModel
  }

  static GetBookNameAutocompleteModel(component: any): AutocompleteModel {
    var autocompleteUtilityModel = new AutocompleteModel();

    autocompleteUtilityModel.onValueChanged = function (value: string): string {
      component.conditionForView.name = value;
      component.generalLedgerService.asyncSelectBookNameBy(StringUtility.SelectLastValue(value)).subscribe(function (httpResponse: any) {
        var result = new Dictionary();
        httpResponse.forEach(function (value: string, index: number, array: any[]) {
          result[value] = value;
        });
        autocompleteUtilityModel.menu = result;
        autocompleteUtilityModel.displayMenu();
      }, function (httpErrorResponse: any) { HttpErrorHandler.Notify(httpErrorResponse); });
      return value;
    };

    autocompleteUtilityModel.onExternalSelected = function (item: any) {
      component.conditionForView.name = autocompleteUtilityModel.inputValue = StringUtility.SeparationSymbolMerge(autocompleteUtilityModel.inputValue, item);
    }

    return autocompleteUtilityModel
  }
}

export class TotalAmount {
  totalAmountNone: Numeral = numeral(0);
  totalAmountAssets: Numeral = numeral(0);
  totalAmountLiabilities: Numeral = numeral(0);
  totalAmountOwnerEquity: Numeral = numeral(0);
  totalAmountRevenues: Numeral = numeral(0);
  totalAmountExpenses: Numeral = numeral(0);

  input(accountingSubjectType: AccountingSubjectType, balanceAmount: number) {
    if (accountingSubjectType == AccountingSubjectType.None)
      this.totalAmountNone.add(balanceAmount);
    else if (accountingSubjectType == AccountingSubjectType.Assets)
      this.totalAmountAssets.add(balanceAmount);
    else if (accountingSubjectType == AccountingSubjectType.Liabilities)
      this.totalAmountLiabilities.add(balanceAmount);
    else if (accountingSubjectType == AccountingSubjectType.OwnerEquity)
      this.totalAmountOwnerEquity.add(balanceAmount);
    else if (accountingSubjectType == AccountingSubjectType.Revenues)
      this.totalAmountRevenues.add(balanceAmount);
    else if (accountingSubjectType == AccountingSubjectType.Expenses)
      this.totalAmountExpenses.add(balanceAmount);
  }
}
