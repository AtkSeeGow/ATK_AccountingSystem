import * as Handsontable from 'handsontable';

import { AutocompleteUtilityModel, Dictionary } from '../utilities/autocompleteUtility/autocompleteUtility.model'
import { ModalUtilityModel, Button } from '../utilities/modalUtility/modalUtility.model'
import { HttpErrorResponseUtility, StringUtility } from '../utilities/commonUtility.component'

export class MaintenanceBookUtility {
    static GetConfirmMessageModal(onClicked: any): ModalUtilityModel {
        const result = new ModalUtilityModel();
        result.title = "是否繼續進行?"
        result.messages = [];
        result.messages.push("目前存在尚在編輯後尚未儲存的資料，若要放棄請點選繼續，否則請取消");
        result.buttons = [];
        result.buttons.push(new Button('Confirm', 'btn btn-default', onClicked));
        result.buttons.push(new Button('Cancel', 'btn btn-default', function () { this.hide(); }.bind(result)));
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
                        this.books[value[0]].isEdit = true;
                    }.bind(this));
                }
            }.bind(component),
            columns: [
                {
                    data: "name",
                    title: "名稱",
                    type: 'autocomplete',
                    source: function (query: any, process: any) {
                        component.maintenanceBookService.asyncSelectNameBy(query).subscribe(function (httpResponse: any) {
                            let result: string[] = [];
                            httpResponse.forEach(function (value: string, index: number, array: any[]) {
                                result.push(value);
                            });
                            process(result);
                        }, function (httpErrorResponse: any) { HttpErrorResponseUtility.Notify(httpErrorResponse); });
                    },
                    strict: false
                },
                {
                    data: "reader",
                    title: "使用者"
                }],
            stretchH: 'last'
        };
    }

    static GetNameAutocompleteUtilityModel(component: any): AutocompleteUtilityModel {
        var autocompleteUtilityModel = new AutocompleteUtilityModel();

        autocompleteUtilityModel.onValueChanged = function (value: string): string {
            component.conditionForView.name = value;
            component.maintenanceBookService.asyncSelectNameBy(StringUtility.SelectLastValue(value)).subscribe(function (httpResponse: any) {
                var result = new Dictionary();
                httpResponse.forEach(function (value: string, index: number, array: any[]) {
                    result[value] = value;
                });
                autocompleteUtilityModel.menu = result;
                autocompleteUtilityModel.displayMenu();
            }, function (httpErrorResponse: any) { HttpErrorResponseUtility.Notify(httpErrorResponse); });
            return value;
        };

        autocompleteUtilityModel.onSelected = function (item: any) {
            var result = "";

            if (item.currentTarget)
                result = item.currentTarget.attributes.key.value;
            else if (item.target)
                result = item.target.attributes.key.value;

            component.conditionForView.name = autocompleteUtilityModel.inputValue = StringUtility.SeparationSymbolMerge(autocompleteUtilityModel.inputValue, result);
        }

        return autocompleteUtilityModel
    }
}