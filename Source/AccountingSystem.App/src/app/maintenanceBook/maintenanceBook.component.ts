import { Component, AfterViewInit, ChangeDetectorRef, AfterViewChecked } from '@angular/core';

import * as moment from 'moment';
import * as Handsontable from 'handsontable';

import { MaintenanceBookUtility } from './maintenanceBook.domain';
import { MaintenanceBookService } from './maintenanceBook.service';

import { AutocompleteModel } from '../common/autocomplete/autocomplete.model'
import { ModalModel } from '../common/modal/modal.model'
import { HttpErrorHandler } from '../common/httpErrorHandler.component'
import { Book } from '../common/book.component'

declare const $: any;

@Component({
  selector: 'maintenanceBookComponent',
  templateUrl: './maintenanceBook.html',
  providers: [MaintenanceBookService]
}) export class MaintenanceBookComponent implements AfterViewInit, AfterViewChecked {
  conditionForFilter: Book = new Book();
  conditionForView: Book = new Book();

  handsontableId: string = "handsontableId";
  handsontableGridSettings: Handsontable.default.GridSettings = MaintenanceBookUtility.GetGridSettings(this);

  books: Book[] = [];

  nameAutocompleteModel: AutocompleteModel = MaintenanceBookUtility.GetNameAutocompleteModel(this);

  confirmMessageModal: ModalModel = MaintenanceBookUtility.GetConfirmMessageModal( () => { this.filter(true); this.confirmMessageModal.hide(); });

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
    }, httpErrorResponse => { HttpErrorHandler.Notify(httpErrorResponse); });
  }

  save() {
    const notify = $.notify({ icon: "tim-icons icon-bell-55", message: "Please Wait" }, { type: 'info', delay: 0, placement: { from: 'top', align: 'right' } });
    this.maintenanceBookService.asyncSaveBy(this.conditionForFilter, this.books).subscribe(httpResponse => {
      notify.close();
      this.filter(true);
    }, httpErrorResponse => { HttpErrorHandler.Notify(httpErrorResponse); });
  }

  clear() {
    this.conditionForView = new Book();
    this.nameAutocompleteModel.inputValue = '';
  }
}
