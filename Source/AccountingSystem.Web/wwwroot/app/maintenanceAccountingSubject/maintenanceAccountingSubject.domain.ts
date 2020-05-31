import * as Handsontable from 'handsontable';

import { ModalUtilityModel, Button } from '../utilities/modalUtility/modalUtility.model'

export class MaintenanceAccountingSubjectUtility {
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
                        this.accountingSubjects[value[0]].isEdit = true;
                    }.bind(this));
                }
            }.bind(component),
            columns: [
                {
                    data: "type",
                    width: 150,
                    title:"類型",
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
            stretchH: 'last'
        };
    } 
}