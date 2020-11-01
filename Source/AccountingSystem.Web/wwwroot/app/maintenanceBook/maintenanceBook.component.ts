import { Component, AfterViewInit, ChangeDetectorRef, AfterViewChecked } from '@angular/core';

import * as moment from 'moment';
import * as Handsontable from 'handsontable';

import { MaintenanceBookUtility } from './maintenanceBook.domain';
import { MaintenanceBookService } from './maintenanceBook.service';

import { AutocompleteUtilityModel } from '../utilities/autocompleteUtility/autocompleteUtility.model'
import { ModalUtilityModel } from '../utilities/modalUtility/modalUtility.model'
import { HttpErrorResponseUtility } from '../utilities/commonUtility.component'
import { Book } from '../utilities/bookUtility.component'

declare const $: any;

@Component({
    selector: 'maintenanceBookComponent',
    templateUrl: './app/maintenanceBook/maintenanceBook.html',
    providers: [MaintenanceBookService]
}) export class MaintenanceBookComponent implements AfterViewInit, AfterViewChecked {
    conditionForFilter: Book = new Book();
    conditionForView: Book = new Book();

    handsontableId: "handsontableId"
    handsontableGridSettings: Handsontable.GridSettings = MaintenanceBookUtility.GetGridSettings(this);

    books: Book[] = [];

    nameAutocompleteUtilityModel: AutocompleteUtilityModel = MaintenanceBookUtility.GetNameAutocompleteUtilityModel(this);

    confirmMessageModal: ModalUtilityModel = MaintenanceBookUtility.GetConfirmMessageModal(function () { this.filter(true); this.confirmMessageModal.hide(); }.bind(this));

    constructor(
        private cdRef: ChangeDetectorRef,
        private maintenanceBookService: MaintenanceBookService) {
    }

    ngAfterViewChecked() {
        this.cdRef.detectChanges();
    }

    ngAfterViewInit() {
        this.clear();
        this.filter(true);
    };

    filter(isProceedDirectly: boolean) {
        const component = this;

        if (!isProceedDirectly) {
            if (this.books.filter(function (value: Book, index: number, array: Book[]) { return value.isEdit }).length > 0) {
                this.confirmMessageModal.show();
                return;
            }
        }

        this.conditionForFilter = Book.Clone(this.conditionForView);

        const notify = $.notify({ icon: "tim-icons icon-bell-55", message: "Please Wait" }, { type: 'info', delay: 0, placement: { from: 'top', align: 'right' } });
        this.maintenanceBookService.asyncFetchBy(this.conditionForFilter).subscribe(httpResponse => {
            notify.close();
            component.books = httpResponse;
            component.books.forEach(function (value: Book, index: number, array: any[]) {
                value.isEdit = false;
            });
        }, httpErrorResponse => { HttpErrorResponseUtility.Notify(httpErrorResponse); });
    }

    save() {
        const notify = $.notify({ icon: "tim-icons icon-bell-55", message: "Please Wait" }, { type: 'info', delay: 0, placement: { from: 'top', align: 'right' } });
        this.maintenanceBookService.asyncSaveBy(this.conditionForFilter, this.books).subscribe(httpResponse => {
            notify.close();
            this.filter(true);
        }, httpErrorResponse => { HttpErrorResponseUtility.Notify(httpErrorResponse); });
    }

    clear() {
        this.conditionForView = new Book();
        this.nameAutocompleteUtilityModel.inputValue = '';
    }
}