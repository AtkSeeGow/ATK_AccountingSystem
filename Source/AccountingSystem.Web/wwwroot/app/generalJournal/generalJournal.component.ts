import { Component, AfterViewInit, ChangeDetectorRef, ViewChild, AfterViewChecked } from '@angular/core';

import * as moment from 'moment';
import * as Handsontable from 'handsontable';

import { GeneralJournalUtility } from './generalJournal.domain';
import { GeneralJournalService } from './generalJournal.service';

import { AutocompleteUtilityModel } from '../utilities/autocompleteUtility/autocompleteUtility.model'
import { HttpErrorResponseUtility, DatePickerUtility } from '../utilities/commonUtility.component'
import { Entry, EntryTypeUtility } from '../utilities/entryUtility.component'
import { Detail } from '../utilities/detailUtility.component'
import { Condition } from '../utilities/conditionUtility.component'

declare const $: any;

@Component({
    selector: 'generalJournalComponent',
    templateUrl: './app/generalJournal/generalJournal.html',
    providers: [GeneralJournalService]
}) export class GeneralJournalComponent implements AfterViewInit, AfterViewChecked {
    DatePickerUtility = DatePickerUtility;

    conditionForView: Condition = new Condition();

    handsontableId: "handsontableId"
    handsontableGridSettings: Handsontable.GridSettings = GeneralJournalUtility.GetGridSettings(this);

    detail: Detail = new Detail();
    details: Detail[] = [];

    accountingSubjectAutocompleteUtilityModel: AutocompleteUtilityModel = GeneralJournalUtility.GetAccountingSubjectAutocompleteUtilityModel(this);
    nameAutocompleteUtilityModel: AutocompleteUtilityModel = GeneralJournalUtility.GetBookNameAutocompleteUtilityModel(this);

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

        this.generalJournalService.asyncFetchEntryBy(condition).subscribe(httpResponse => {
            notify.close();
            component.details = httpResponse;
            component.details.forEach(function (detail: Detail) {
                detail.tradingDay = moment(detail.tradingDay).format("YYYY/MM/DD");
                detail.entrys.forEach(function (entry: Entry) {
                    entry.type = EntryTypeUtility.ToString(entry.type);
                });
            });
        }, httpErrorResponse => { HttpErrorResponseUtility.Notify(httpErrorResponse); });
    }

    save(detail: Detail) {
        const notify = $.notify({ icon: "tim-icons icon-bell-55", message: "Please Wait" }, { type: 'info', delay: 0, placement: { from: 'top', align: 'right' } });

        this.generalJournalService.asyncSaveBy(Detail.Clone(detail)).subscribe(httpResponse => {
            notify.close();
            this.filter();
        }, httpErrorResponse => { HttpErrorResponseUtility.Notify(httpErrorResponse); });
    }

    delete(detail: Detail) {
        const notify = $.notify({ icon: "tim-icons icon-bell-55", message: "Please Wait" }, { type: 'info', delay: 0, placement: { from: 'top', align: 'right' }});

        this.generalJournalService.asyncDeleteBy(Detail.Clone(detail)).subscribe(httpResponse => {
            notify.close();
            this.filter();
        }, httpErrorResponse => { HttpErrorResponseUtility.Notify(httpErrorResponse); });
    }

    clear() {
        this.conditionForView = new Condition();

        this.accountingSubjectAutocompleteUtilityModel.inputValue = '';
        this.nameAutocompleteUtilityModel.inputValue = '';

        let tradingDayBegin = moment().add(-3, 'M');
        this.conditionForView.tradingDayBegin = { date: { year: tradingDayBegin.year(), month: tradingDayBegin.month() + 1, day: tradingDayBegin.date() } };

        let tradingDayEnd = moment();
        this.conditionForView.tradingDayBegin = { date: { year: tradingDayBegin.year(), month: tradingDayBegin.month() + 1, day: tradingDayBegin.date() } };
    }
}