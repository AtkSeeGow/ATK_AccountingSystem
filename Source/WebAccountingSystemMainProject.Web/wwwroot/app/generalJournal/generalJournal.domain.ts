import * as Handsontable from 'handsontable';

import { AutocompleteUtilityModel, Dictionary } from '../utilities/autocompleteUtility/autocompleteUtility.model'
import { ModalUtilityModel, Button } from '../utilities/modalUtility/modalUtility.model'
import { AccountingSubject } from '../utilities/accountingSubjectUtility.component'
import { HttpErrorResponseUtility, StringUtility } from '../utilities/commonUtility.component'

export class GeneralJournalUtility {
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

    static GetGridSettings(component: any): Handsontable.GridSettings{
        return {
            colHeaders: true,
            rowHeaders: true,
            minSpareCols: 1,
            minSpareRows: 1,
            autoWrapRow: true,
            afterChange: function (changes: any, source: any) {
                if (source) {
                    source.forEach(function (value: any, index: number, array: any[]) {
                        this.entrys[value[0]].isEdit = true;
                    }.bind(this));
                }
            }.bind(component),
            columns: [
                {
                    data: "entryBookName",
                    title: "Book Name",
                    type: 'autocomplete',
                    source: function (query: any, process: any) {
                        component.generalJournalService.asyncSelectBookNameBy(query).subscribe(function (httpResponse: any) {
                            let result: string[] = [];
                            httpResponse.forEach(function (value: string, index: number, array: any[]) {
                                result.push(value);
                            });
                            process(result);
                        }, function (httpErrorResponse: any) { HttpErrorResponseUtility.Handler(httpErrorResponse, this.errorMessageModal); });
                    },
                    strict: false
                },
                {
                    data: "entryType",
                    title: "Entry Type",
                    type: 'dropdown',
                    source: ['Debits', 'Credits']
                },
                {
                    data: "entryTradingDay",
                    title: "Trading Day",
                    type: 'date',
                    dateFormat: 'YYYY/MM/DD',
                    correctFormat: true,
                    datePickerConfig: {
                        firstDay: 0,
                        showWeekNumber: true,
                        numberOfMonths: 2
                    }
                },
                {
                    data: "entryAccountingSubject",
                    title: "Accounting Subject",
                    type: 'autocomplete',
                    source: function (query: any, process: any) {
                        component.generalJournalService.asyncAutocompleteAccountingSubject(query).subscribe(function (httpResponse: any) {
                            let result: string[] = [];
                            httpResponse.forEach(function (value: AccountingSubject, index: number, array: any[]) {
                                result.push(value.accountingSubjectCode + '(' + value.accountingSubjectName + ')');
                            });
                            process(result);
                        }, function (httpErrorResponse: any) { HttpErrorResponseUtility.Handler(httpErrorResponse, this.errorMessageModal); });
                    },
                    strict: false
                },
                {
                    data: "entryAmount",
                    title: "Amount",
                    type: 'numeric',
                    numericFormat: {
                        pattern: '$0,0.00',
                        culture: 'zh-TW'
                    },
                },
                {
                    data: "entrySummary",
                    title: "Summary"
                }],
            stretchH: 'last'
        };
    }

    static GetAccountingSubjectAutocompleteUtilityModel(component: any): AutocompleteUtilityModel {
        var autocompleteUtilityModel = new AutocompleteUtilityModel();

        autocompleteUtilityModel.onValueChanged = function (value: string): string {
            component.conditionForView.entryAccountingSubject = value;
            component.generalJournalService.asyncAutocompleteAccountingSubject(StringUtility.SelectLastValue(value)).subscribe(function (httpResponse: any) {
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
            component.generalJournalService.asyncSelectBookNameBy(StringUtility.SelectLastValue(value)).subscribe(function (httpResponse: any) {
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