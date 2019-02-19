import { AutocompleteUtilityModel, Dictionary } from '../utilities/autocompleteUtility/autocompleteUtility.model'
import { ModalUtilityModel, Button } from '../utilities/modalUtility/modalUtility.model'
import { AccountingSubject, AccountingSubjectType } from '../utilities/accountingSubjectUtility.component'
import { HttpErrorResponseUtility, StringUtility } from '../utilities/commonUtility.component'

import * as numeral from 'numeral';

export class GeneralLedgerUtility {
    static GetConfirmMessageModal(onClicked: any): ModalUtilityModel {
        var result = new ModalUtilityModel();
        result.title = "是否繼續進行?"
        result.messages = [];
        result.messages.push("目前存在尚在編輯後尚未儲存的資料，若要放棄請點選繼續，否則請取消");
        result.buttons = [];
        result.buttons.push(new Button('Confirm', 'btn btn-default', onClicked));
        result.buttons.push(new Button('Cancel', 'btn btn-default', function () { this.hide(); }.bind(result)));
        return result;
    }

    static GetCompleteMessageModal() {
        var result = new ModalUtilityModel();
        result.title = "儲存完成";
        return result;
    }

    static GetAccountingSubjectAutocompleteUtilityModel(component: any): AutocompleteUtilityModel {
        var autocompleteUtilityModel = new AutocompleteUtilityModel();

        autocompleteUtilityModel.onValueChanged = function (value: string): string {
            component.conditionForView.entryAccountingSubject = value;
            component.generalLedgerService.asyncAutocompleteAccountingSubject(StringUtility.SelectLastValue(value)).subscribe(function (httpResponse: any) {
                var result = new Dictionary();
                httpResponse.forEach(function (value: AccountingSubject, index: number, array: any[]) {
                    result[value.accountingSubjectCode] = value.accountingSubjectCode + '(' + value.accountingSubjectName + ')'
                });
                autocompleteUtilityModel.menu = result;
                autocompleteUtilityModel.displayMenu();
            }, function (httpErrorResponse: any) { HttpErrorResponseUtility.Handler(httpErrorResponse, component.errorMessageModal); });
            return value;
        };

        autocompleteUtilityModel.onSelected = function (item: any) {
            var result = "";

            if (item.currentTarget)
                result = item.currentTarget.attributes.key.value;
            else if (item.target)
                result = item.target.attributes.key.value;

            component.conditionForView.entryAccountingSubject = autocompleteUtilityModel.inputValue = StringUtility.SeparationSymbolMerge(autocompleteUtilityModel.inputValue, result);
        }

        return autocompleteUtilityModel
    }

    static GetBookNameAutocompleteUtilityModel(component: any): AutocompleteUtilityModel {
        var autocompleteUtilityModel = new AutocompleteUtilityModel();

        autocompleteUtilityModel.onValueChanged = function (value: string): string {
            component.conditionForView.entryBookName = value;
            component.generalLedgerService.asyncSelectBookNameBy(StringUtility.SelectLastValue(value)).subscribe(function (httpResponse: any) {
                var result = new Dictionary();
                httpResponse.forEach(function (value: string, index: number, array: any[]) {
                    result[value] = value;
                });
                autocompleteUtilityModel.menu = result;
                autocompleteUtilityModel.displayMenu();
            }, function (httpErrorResponse: any) { HttpErrorResponseUtility.Handler(httpErrorResponse, component.errorMessageModal); });
            return value;
        };

        autocompleteUtilityModel.onSelected = function (item: any) {
            var result = "";

            if (item.currentTarget)
                result = item.currentTarget.attributes.key.value;
            else if (item.target)
                result = item.target.attributes.key.value;

            component.conditionForView.entryBookName = autocompleteUtilityModel.inputValue = StringUtility.SeparationSymbolMerge(autocompleteUtilityModel.inputValue, result);
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

    input(accountingSubjectType: AccountingSubjectType, balanceAmount:number) {
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