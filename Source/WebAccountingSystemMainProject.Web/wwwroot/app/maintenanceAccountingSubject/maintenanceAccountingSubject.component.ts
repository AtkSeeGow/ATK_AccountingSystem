import { Component } from '@angular/core';

import * as Handsontable from 'handsontable';

import { MaintenanceAccountingSubjectUtility } from './maintenanceAccountingSubject.domain';
import { MaintenanceAccountingSubjectService } from './maintenanceAccountingSubject.service';
import { ModalUtilityModel, Button } from '../utilities/modalUtility/modalUtility.model'
import { AccountingSubjectTypeUtility, AccountingSubject } from '../utilities/accountingSubjectUtility.component'
import { HttpErrorResponseUtility } from '../utilities/commonUtility.component'

declare const $: any;

@Component({
    selector: 'maintenanceAccountingSubjectComponent',  
    templateUrl: './app/maintenanceAccountingSubject/maintenanceAccountingSubject.html',
    providers: [MaintenanceAccountingSubjectService]
})
export class MaintenanceAccountingSubjectComponent {
    conditionForFilter: AccountingSubject = new AccountingSubject();
    conditionForView: AccountingSubject = new AccountingSubject();

    handsontableId: "handsontableId"
    handsontableGridSettings: Handsontable.GridSettings = MaintenanceAccountingSubjectUtility.GetGridSettings(this);

    accountingSubjects: AccountingSubject[] = [];

    confirmMessageModal: ModalUtilityModel = MaintenanceAccountingSubjectUtility.GetConfirmMessageModal(function () { this.filter(true); this.confirmMessageModal.hide(); }.bind(this));
    completeMessageModal: ModalUtilityModel = MaintenanceAccountingSubjectUtility.GetCompleteMessageModal();
    errorMessageModal: ModalUtilityModel = new ModalUtilityModel();

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

        $.blockUI();
        this.maintenanceAccountingSubjectService.asyncFetchAccountingSubjectBy(this.conditionForFilter).subscribe(httpResponse => {
            $.unblockUI();
            component.accountingSubjects = httpResponse;
            component.accountingSubjects.forEach(function (value: AccountingSubject, index: number, array: any[]) {
                value.accountingSubjectType = AccountingSubjectTypeUtility.ToString(value.accountingSubjectType);
                value.isEdit = false;
            });
        }, httpErrorResponse => { HttpErrorResponseUtility.Handler(httpErrorResponse, this.errorMessageModal); });
    }

    clear() {
        this.conditionForView = new AccountingSubject(); 
    }

    save() {
        var component = this;

        $.blockUI();
        this.maintenanceAccountingSubjectService.asyncSaveAccountingSubjectBy(this.conditionForFilter, this.accountingSubjects).subscribe(httpResponse => {
            $.unblockUI();
            this.filter(true);
            this.completeMessageModal.show();
        }, httpErrorResponse => { HttpErrorResponseUtility.Handler(httpErrorResponse, this.errorMessageModal); });
    }
}