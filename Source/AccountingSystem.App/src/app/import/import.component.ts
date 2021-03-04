import { Component, AfterViewInit, ChangeDetectorRef, AfterViewChecked } from '@angular/core';

import { GeneralJournalUtility } from '../generalJournal/generalJournal.domain'
import { GeneralJournalService } from '../generalJournal/generalJournal.service'

import { ImportUtility, ViewType } from './import.domain';
import { ImportService } from './import.service';

import { AutocompleteModel } from '../common/autocomplete/autocomplete.model'

import { DatePickerUtility } from '../common/utility.component'
import { Condition } from '../common/condition.component'
import { HttpErrorHandler } from '../common/httpErrorHandler.component'
import { Detail } from '../common/detail.component'
import { Entry, EntryTypeUtility } from '../common/entry.component'

import * as moment from 'moment';
import * as Handsontable from 'handsontable';

declare const $: any;

@Component({
  selector: 'importComponent',
  templateUrl: './import.html',
  providers: [ImportService, GeneralJournalService]
}) export class ImportComponent implements AfterViewInit, AfterViewChecked {
  DatePickerUtility = DatePickerUtility;

  ViewType = ViewType;
  viewType: ViewType = ViewType.Upload;

  objectKeys = Object.keys;

  conditionForView: Condition = new Condition();

  handsontableId: string = "handsontableId";
  handsontableGridSettings: Handsontable.default.GridSettings = GeneralJournalUtility.GetGridSettings(this);

  accountingSubjectAutocompleteModel: AutocompleteModel = GeneralJournalUtility.GetAccountingSubjectAutocompleteModel(this);
  nameAutocompleteModel: AutocompleteModel = GeneralJournalUtility.GetBookNameAutocompleteModel(this);

  conflictDetails: Detail[] = [];
  normalDetails: Detail[] = [];
  repeatDetails: any = {};

  constructor(
    private cdRef: ChangeDetectorRef,
    private importService: ImportService,
    private generalJournalService: GeneralJournalService) {
    this.conditionForView.name = "";
    this.conditionForView.accountingSubjectCode = "";
  }

  ngAfterViewInit(): void {
    const component = this;

    $('#fileUploadAttachment').fileupload(ImportUtility.getFileUploadConfig(
      function (element: any, target: any) {
        component.viewType = ViewType.Check;

        component.conflictDetails = target.result.conflictDetails;
        component.conflictDetails.forEach(function (detail: any) {
          detail = Detail.Parse(detail);
          detail.isRepeat = false;
        });

        component.normalDetails = target.result.normalDetails;
        component.normalDetails.forEach(function (detail: any) {
          detail = Detail.Parse(detail);
          detail.isRepeat = false;
        });
      }.bind(component),
      function () {
        component.conditionForView.tradingDayBegin = null;
        component.conditionForView.tradingDayEnd = null;
        return component.conditionForView.clone();
      }
    ));
  }

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }

  classify(detail: Detail) {
    this.normalDetails.push(detail);
    this.normalDetails.sort((a: Detail, b: Detail) => {
      if (a.tradingDay.singleDate.formatted < b.tradingDay.singleDate.formatted)
        return -1;
      if (a.tradingDay.singleDate.formatted > b.tradingDay.singleDate.formatted)
        return 1;
      return 0;

    });
    this.conflictDetails = this.conflictDetails.filter(function (item) { return item !== detail; });
  }

  isDisableValid() {
    return this.conflictDetails.length !== 0 || this.normalDetails.length === 0;
  }

  valid() {
    const component = this;

    this.conditionForView.tradingDayBegin = new Date(this.normalDetails[0].tradingDay.singleDate.formatted);
    this.conditionForView.tradingDayEnd = new Date(this.normalDetails[this.normalDetails.length - 1].tradingDay.singleDate.formatted);

    this.repeatDetails = {};

    this.generalJournalService.asyncFetchBy(this.conditionForView).subscribe(httpResponse => {
      this.viewType = ViewType.Valid;

      const repeatDetails = httpResponse;
      repeatDetails.forEach(function (repeatDetail: any) {
        repeatDetail = Detail.Parse(repeatDetail);

        var tradingDay = repeatDetail.tradingDay.singleDate.formatted;

        if (!(tradingDay in component.repeatDetails))
          component.repeatDetails[tradingDay] = { repeatDetails: [], normalDetails: [] };
        component.repeatDetails[tradingDay].repeatDetails.push(repeatDetail);

        repeatDetail.isRepeat = false;
        component.normalDetails.forEach(function (normalDetail: any) {
          if (normalDetail.isRepeat === false &&
            Detail.Equals(repeatDetail, normalDetail)) {
            repeatDetail.isRepeat = true;
            normalDetail.isRepeat = true;
          }
        });
      });

      component.normalDetails.forEach(function (detail: Detail) {
        var tradingDay = detail.tradingDay.singleDate.formatted;
        if (!(tradingDay in component.repeatDetails))
          component.repeatDetails[tradingDay] = { repeatDetails: [], normalDetails: [] };
        component.repeatDetails[tradingDay].normalDetails.push(detail);
      });

      const temp: { [index: string]: any } = {};
      const keys = Object.keys(component.repeatDetails);
      keys.sort();
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        temp[key] = component.repeatDetails[key];
        temp[key].isExpand = false;
      }
      component.repeatDetails = temp;
    }, httpErrorResponse => { HttpErrorHandler.Notify(httpErrorResponse); });
  }

  isDisableSave() {
    return this.viewType !== ViewType.Valid || this.normalDetails.length === 0;
  }

  save() {
    const details: Detail[] = [];
    this.normalDetails.forEach(function (detail: any) {
      if (!detail.isRepeat)
        details.push(Detail.Clone(detail));
    });

    const notify = $.notify({ icon: "tim-icons icon-bell-55", message: "Please Wait" }, { type: 'info', delay: 0, placement: { from: 'top', align: 'right' } });

    this.importService.asyncSavesBy(details).subscribe(httpResponse => {
      notify.close();
      this.viewType = ViewType.Upload;
    }, httpErrorResponse => { HttpErrorHandler.Notify(httpErrorResponse); });
  }

  update(detail: Detail) {
    const notify = $.notify({ icon: "tim-icons icon-bell-55", message: "Please Wait" }, { type: 'info', delay: 0, placement: { from: 'top', align: 'right' } });

    this.generalJournalService.asyncSaveBy(Detail.Clone(detail)).subscribe(httpResponse => {
      notify.close();
      this.valid();
    }, httpErrorResponse => { HttpErrorHandler.Notify(httpErrorResponse); });
  }

  deleteConflictDetails(detail: Detail) {
    this.conflictDetails = this.conflictDetails.filter(function (item) { return item !== detail; });
  }

  deleteNormalDetails(detail: Detail) {
    this.normalDetails = this.normalDetails.filter(function (item) { return item !== detail; });
  }

  delete(detail: Detail) {
    const notify = $.notify({ icon: "tim-icons icon-bell-55", message: "Please Wait" }, { type: 'info', delay: 0, placement: { from: 'top', align: 'right' } });

    this.generalJournalService.asyncDeleteBy(Detail.Clone(detail)).subscribe(httpResponse => {
      notify.close();
      this.valid();
    }, httpErrorResponse => { HttpErrorHandler.Notify(httpErrorResponse); });
  }

  reverseIsRepeat(detail: any) {
    detail.isRepeat = !detail.isRepeat;
  }

  expand(key: any) {
    this.repeatDetails[key].isExpand = !this.repeatDetails[key].isExpand;
  }

  filter(details: Detail[], isRepeat: boolean) {
    return details.filter(function (detail: any) { return detail.isRepeat === isRepeat });
  }
}
