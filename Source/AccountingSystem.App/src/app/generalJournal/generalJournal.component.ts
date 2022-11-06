import { Component, AfterViewInit, ChangeDetectorRef, ViewChild, AfterViewChecked } from '@angular/core';

import * as moment from 'moment';
import * as Handsontable from 'handsontable';

import { GeneralJournalUtility } from './generalJournal.domain';
import { GeneralJournalService } from './generalJournal.service';

import { AutocompleteModel } from '../common/autocomplete/autocomplete.model'
import { DatePickerUtility } from '../common/utility.component'
import { Detail } from '../common/detail.component'
import { Condition } from '../common/condition.component'

import { HttpErrorHandler } from '../common/httpErrorHandler.component';

declare const $: any;

@Component({
  selector: 'generalJournalComponent',
  templateUrl: './generalJournal.html',
  providers: [GeneralJournalService]
}) export class GeneralJournalComponent implements AfterViewInit, AfterViewChecked {
  DatePickerUtility = DatePickerUtility;

  conditionForView: Condition = new Condition();

  handsontableId: string = "handsontableId";
  handsontableGridSettings: Handsontable.default.GridSettings = GeneralJournalUtility.GetGridSettings(this);

  detail: Detail = new Detail();
  details: Detail[] = [];

  accountingSubjectAutocompleteModel: AutocompleteModel = GeneralJournalUtility.GetAccountingSubjectAutocompleteModel(this);
  nameAutocompleteModel: AutocompleteModel = GeneralJournalUtility.GetBookNameAutocompleteModel(this);

  constructor(
    private cdRef: ChangeDetectorRef,
    private generalJournalService: GeneralJournalService) {
  }

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }

  ngAfterViewInit() {
    this.clear();
    this.filter();
  };

  filter() {
    const component = this;

    const condition = this.conditionForView.clone();

    const notify = $.notify({ icon: "tim-icons icon-bell-55", message: "Please Wait" }, { type: 'info', delay: 0, placement: { from: 'top', align: 'right' } });

    this.generalJournalService.asyncFetchBy(condition).subscribe(httpResponse => {
      notify.close();
      component.details = httpResponse;
      component.details.forEach(function (detail: Detail) {
        detail = Detail.Parse(detail);
      });
    }, httpErrorResponse => { HttpErrorHandler.Notify(httpErrorResponse); });
  }

  save(detail: Detail) {
    const notify = $.notify({ icon: "tim-icons icon-bell-55", message: "Please Wait" }, { type: 'info', delay: 0, placement: { from: 'top', align: 'right' } });

    this.generalJournalService.asyncSaveBy(Detail.Clone(detail)).subscribe(httpResponse => {
      notify.close();
      this.filter();
    }, httpErrorResponse => { HttpErrorHandler.Notify(httpErrorResponse); });
  }

  delete(detail: Detail) {
    const notify = $.notify({ icon: "tim-icons icon-bell-55", message: "Please Wait" }, { type: 'info', delay: 0, placement: { from: 'top', align: 'right' } });

    this.generalJournalService.asyncDeleteBy(Detail.Clone(detail)).subscribe(httpResponse => {
      notify.close();
      this.filter();
    }, httpErrorResponse => { HttpErrorHandler.Notify(httpErrorResponse); });
  }

  clear() {
    this.conditionForView = new Condition();

    this.accountingSubjectAutocompleteModel.inputValue = '';
    this.nameAutocompleteModel.inputValue = '';

    let tradingDayBegin = moment().add(-1, 'M');
    this.conditionForView.tradingDayBegin = {
      isRange: false, singleDate: {
        date: {
          year: tradingDayBegin.year(),
          month: tradingDayBegin.month() + 1,
          day: tradingDayBegin.date()
        }
      }
    }

    let tradingDayEnd = moment();
    this.conditionForView.tradingDayEnd = {
      isRange: false, singleDate: {
        date: {
          year: tradingDayEnd.year(),
          month: tradingDayEnd.month() + 1,
          day: tradingDayEnd.date()
        }
      }
    }
  }
}
