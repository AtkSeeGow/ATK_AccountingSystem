import { Component } from '@angular/core';

import * as Handsontable from 'handsontable';

import { MaintenanceAccountingSubjectUtility } from './maintenanceAccountingSubject.domain';
import { MaintenanceAccountingSubjectService } from './maintenanceAccountingSubject.service';
import { ModalModel } from '../common/modal/modal.model'
import { AccountingSubjectTypeUtility, AccountingSubject } from '../common/accountingSubject.component'
import { HttpErrorHandler } from '../common/httpErrorHandler.component'

declare const $: any;

@Component({
  selector: 'maintenanceAccountingSubjectComponent',
  templateUrl: './maintenanceAccountingSubject.html',
  providers: [MaintenanceAccountingSubjectService]
})
export class MaintenanceAccountingSubjectComponent {
  conditionForFilter: AccountingSubject = new AccountingSubject();
  conditionForView: AccountingSubject = new AccountingSubject();

  handsontableId: string = "handsontableId"
  handsontableGridSettings: Handsontable.default.GridSettings = MaintenanceAccountingSubjectUtility.GetGridSettings(this);

  accountingSubjects: AccountingSubject[] = [];

  confirmMessageModal: ModalModel = MaintenanceAccountingSubjectUtility.GetConfirmMessageModal( () => { this.filter(true); this.confirmMessageModal.hide(); });

  constructor(private maintenanceAccountingSubjectService: MaintenanceAccountingSubjectService) {
    this.filter(true);
  }

  filter(isProceedDirectly: boolean) {
    var component = this;

    if (!isProceedDirectly) {
      if (this.accountingSubjects.filter(function (value: AccountingSubject, index: number, array: AccountingSubject[]) { return value.isEdit }).length > 0) {
        this.confirmMessageModal.show();
        return;
      }
    }

    this.conditionForFilter = AccountingSubject.Clone(this.conditionForView);

    const notify = $.notify({ icon: "tim-icons icon-bell-55", message: "Please Wait" }, { type: 'info', delay: 0, placement: { from: 'top', align: 'right' } });
    this.maintenanceAccountingSubjectService.asyncFetchBy(this.conditionForFilter).subscribe(httpResponse => {
      notify.close();
      component.accountingSubjects = httpResponse;
      component.accountingSubjects.forEach(function (value: AccountingSubject, index: number, array: any[]) {
        value.type = AccountingSubjectTypeUtility.ToString(value.type);
        value.isEdit = false;
      });
    }, httpErrorResponse => { HttpErrorHandler.Notify(httpErrorResponse); });
  }

  clear() {
    this.conditionForView = new AccountingSubject();
  }

  save() {
    var component = this;

    const notify = $.notify({ icon: "tim-icons icon-bell-55", message: "Please Wait" }, { type: 'info', delay: 0, placement: { from: 'top', align: 'right' } });
    this.maintenanceAccountingSubjectService.asyncSaveBy(this.conditionForFilter, this.accountingSubjects).subscribe(httpResponse => {
      notify.close();
      this.filter(true);
    }, httpErrorResponse => { HttpErrorHandler.Notify(httpErrorResponse); });
  }
}
