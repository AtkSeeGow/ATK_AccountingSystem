import * as Handsontable from 'handsontable';

import { AutocompleteUtilityModel, Dictionary } from '../utilities/autocompleteUtility/autocompleteUtility.model'
import { AccountingSubject } from '../utilities/accountingSubjectUtility.component'
import { HttpErrorResponseUtility, StringUtility } from '../utilities/commonUtility.component'

export class GeneralJournalUtility {
    static GetGridSettings(component: any): Handsontable.GridSettings{
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
                        }, function (httpErrorResponse: any) { HttpErrorResponseUtility.Notify(httpErrorResponse); });
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

    static GetAccountingSubjectAutocompleteUtilityModel(component: any): AutocompleteUtilityModel {
        const autocompleteUtilityModel = new AutocompleteUtilityModel();

        autocompleteUtilityModel.onValueChanged = function (value: string): string {
            component.conditionForView.accountingSubjectCode = value;
            component.generalJournalService.asyncAutocompleteAccountingSubject(StringUtility.SelectLastValue(value)).subscribe(function (httpResponse: any) {
                const result = new Dictionary();
                httpResponse.forEach(function (value: AccountingSubject) {
                    result[value.code] = value.code + '(' + value.name + ')'
                });
                autocompleteUtilityModel.menu = result;
                autocompleteUtilityModel.displayMenu();
            }, function (httpErrorResponse: any) { HttpErrorResponseUtility.Notify(httpErrorResponse); });
            return value;
        };

        autocompleteUtilityModel.onSelected = function (item: any) {
            let result = "";

            if (item.currentTarget)
                result = item.currentTarget.attributes.key.value;
            else if (item.target)
                result = item.target.attributes.key.value;

            component.conditionForView.accountingSubjectCode = autocompleteUtilityModel.inputValue = StringUtility.SeparationSymbolMerge(autocompleteUtilityModel.inputValue, result);
        }

        return autocompleteUtilityModel
    }

    static GetBookNameAutocompleteUtilityModel(component: any): AutocompleteUtilityModel {
        const autocompleteUtilityModel = new AutocompleteUtilityModel();

        autocompleteUtilityModel.onValueChanged = function (value: string): string {
            component.conditionForView.name = value;
            component.generalJournalService.asyncSelectBookNameBy(StringUtility.SelectLastValue(value)).subscribe(function (httpResponse: any) {
                const result = new Dictionary();
                httpResponse.forEach(function (value: string) {
                    result[value] = value;
                });
                autocompleteUtilityModel.menu = result;
                autocompleteUtilityModel.displayMenu();
            }, function (httpErrorResponse: any) { HttpErrorResponseUtility.Notify(httpErrorResponse); });
            return value;
        };

        autocompleteUtilityModel.onSelected = function (item: any) {
            let result = "";

            if (item.currentTarget)
                result = item.currentTarget.attributes.key.value;
            else if (item.target)
                result = item.target.attributes.key.value;

            component.conditionForView.name = autocompleteUtilityModel.inputValue = StringUtility.SeparationSymbolMerge(autocompleteUtilityModel.inputValue, result);
        }

        return autocompleteUtilityModel
    }
}