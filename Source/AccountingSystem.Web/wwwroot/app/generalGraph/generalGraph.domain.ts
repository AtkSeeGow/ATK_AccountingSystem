import { AutocompleteUtilityModel, Dictionary } from '../utilities/autocompleteUtility/autocompleteUtility.model'
import { AccountingSubject } from '../utilities/accountingSubjectUtility.component'
import { HttpErrorResponseUtility, StringUtility } from '../utilities/commonUtility.component'

import * as numeral from 'numeral';

export class GeneralGraphUtility {
    static GetAccountingSubjectAutocompleteUtilityModel(component: any): AutocompleteUtilityModel {
        var autocompleteUtilityModel = new AutocompleteUtilityModel();

        autocompleteUtilityModel.onValueChanged = function (value: string): string {
            component.conditionForView.entryAccountingSubject = value;
            component.generalGraphService.asyncAutocompleteAccountingSubject(StringUtility.SelectLastValue(value)).subscribe(function (httpResponse: any) {
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
            component.generalGraphService.asyncSelectBookNameBy(StringUtility.SelectLastValue(value)).subscribe(function (httpResponse: any) {
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