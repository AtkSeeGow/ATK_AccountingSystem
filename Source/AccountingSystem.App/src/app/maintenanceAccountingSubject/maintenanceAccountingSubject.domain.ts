import * as Handsontable from 'handsontable';

import { ModalModel, Button } from '../common/modal/modal.model'

export class MaintenanceAccountingSubjectUtility {
  static GetConfirmMessageModal(onClicked: any): ModalModel {
    var result = new ModalModel();
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
      height: 'auto',
      afterChange: (changes: any, source: any) => {
        if (changes) {
          changes.forEach((value: any, index: number, array: any[]) => {
            component.accountingSubjects[value[0]].isEdit = true;
          });
        }
      },
      columns: [
        {
          data: "type",
          width: 150,
          title: "類型",
          type: 'dropdown',
          source: ['Assets', 'Liabilities', 'OwnerEquity', 'Revenues', 'Expenses']
        },
        {
          data: "code",
          title: "代號"
        },
        {
          data: "name",
          title: "名稱"
        },
        {
          data: "description",
          title: "描述"
        }],
      preventOverflow: 'horizontal',
      stretchH: 'last'
    };
  }
}
