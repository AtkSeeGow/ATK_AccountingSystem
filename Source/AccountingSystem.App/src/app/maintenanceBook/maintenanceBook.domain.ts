import * as Handsontable from 'handsontable';

import { AutocompleteModel, Dictionary } from '../common/autocomplete/autocomplete.model'
import { ModalModel, Button } from '../common/modal/modal.model'
import { StringUtility } from '../common/utility.component'
import { HttpErrorHandler } from '../common/httpErrorHandler.component'

export class MaintenanceBookUtility {
  static GetConfirmMessageModal(onClicked: any): ModalModel {
    const result = new ModalModel();
    result.title = "是否繼續進行?"
    result.messages = [];
    result.messages.push("目前存在尚在編輯後尚未儲存的資料，若要放棄請點選繼續，否則請取消");
    result.buttons = [];
    result.buttons.push(new Button('Confirm', 'btn btn-default', onClicked));
    result.buttons.push(new Button('Cancel', 'btn btn-default', () => { result.hide(); }));
    return result;
  }

  static GetGridSettings(component: any): Handsontable.default.GridSettings {
    return {
      colHeaders: true,
      rowHeaders: true,
      minSpareCols: 1,
      minSpareRows: 1,
      autoWrapRow: true,
      afterChange: function (changes: any, source: any) {
        if (changes) {
          changes.forEach( (value: any, index: number, array: any[]) => {
            component.books[value[0]].isEdit = true;
          });
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
            }, function (httpErrorResponse: any) { HttpErrorHandler.Notify(httpErrorResponse); });
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

  static GetNameAutocompleteModel(component: any): AutocompleteModel {
    var autocompleteModel = new AutocompleteModel();

    autocompleteModel.onValueChanged = function (value: string): string {
      component.conditionForView.name = value;
      component.maintenanceBookService.asyncSelectNameBy(StringUtility.SelectLastValue(value)).subscribe(function (httpResponse: any) {
        var result = new Dictionary();
        httpResponse.forEach(function (value: string, index: number, array: any[]) {
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

    return autocompleteModel
  }
}
