import { Component, AfterViewInit, ChangeDetectorRef, ViewChild, AfterViewChecked } from '@angular/core';

import * as moment from 'moment';
import * as Handsontable from 'handsontable';

import { MaintenanceBookUtility } from './maintenanceBook.domain';
import { MaintenanceBookService } from './maintenanceBook.service';

import { AutocompleteUtilityModel } from '../utilities/autocompleteUtility/autocompleteUtility.model'
import { ModalUtilityModel, Button } from '../utilities/modalUtility/modalUtility.model'
import { HttpErrorResponseUtility, DatePickerUtility } from '../utilities/commonUtility.component'
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
    completeMessageModal: ModalUtilityModel = MaintenanceBookUtility.GetCompleteMessageModal();
    errorMessageModal: ModalUtilityModel = new ModalUtilityModel();

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
        var component = this;

        if (!isProceedDirectly) {
            if (this.books.filter(function (value: Book, index: number, array: Book[]) { return value.isEdit }).length > 0) {
                this.confirmMessageModal.show();
                return;
            }
        }

        this.conditionForFilter = Book.Clone(this.conditionForView);

        $.blockUI();
        this.maintenanceBookService.asyncFetchBookBy(this.conditionForFilter).subscribe(httpResponse => {
            $.unblockUI();
            component.books = httpResponse;
            component.books.forEach(function (value: Book, index: number, array: any[]) {
                value.isEdit = false;
            });
        }, httpErrorResponse => { HttpErrorResponseUtility.Handler(httpErrorResponse, this.errorMessageModal); });
    }

    save() {
        var component = this;

        $.blockUI();
        this.maintenanceBookService.asyncSaveBookBy(this.conditionForFilter, this.books).subscribe(httpResponse => {
            $.unblockUI();
            this.filter(true);
            this.completeMessageModal.show();
        }, httpErrorResponse => { HttpErrorResponseUtility.Handler(httpErrorResponse, this.errorMessageModal); });
    }

    clear() {
        this.conditionForView = new Book();
    }
}