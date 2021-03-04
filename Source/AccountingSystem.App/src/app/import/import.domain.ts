declare const $: any;

export class ImportUtility {
  static getFileUploadConfig(onUploadDone: (element: any, target: any) => void, onGetData: () => any): any {
    const result =
    {
      maxNumberOfFiles: 1,
      add: function (e: any, data: any) {
        let i: number;
        for (i = 0; i < data.files.length; i++) {
          data.formData = onGetData();
          data.submit();
        }
      },
      done: onUploadDone,
      fail: function (e: any, data: any) {
        $.notify({ icon: "tim-icons icon-bell-55", message: "附件上傳錯誤，請重試或聯絡系統管理員!" }, { type: 'warning', delay: 0, placement: { from: 'top', align: 'right' } });
      }
    }
    return result;
  }
}

export enum ViewType {
  /** 上傳 */
  Upload,
  /** 檢查 */
  Check,
  /** 驗證 */
  Valid,
  /** 儲存 */
  Save
}
