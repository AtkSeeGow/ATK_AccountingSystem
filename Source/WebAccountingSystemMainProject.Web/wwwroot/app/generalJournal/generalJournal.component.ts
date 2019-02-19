import { Component, AfterViewInit, ChangeDetectorRef, ViewChild, AfterViewChecked } from '@angular/core';

import * as moment from 'moment';
import * as Handsontable from 'handsontable';

import { GeneralJournalUtility } from './generalJournal.domain';
import { GeneralJournalService } from './generalJournal.service';

import { AutocompleteUtilityModel } from '../utilities/autocompleteUtility/autocompleteUtility.model'
import { ModalUtilityModel, Button } from '../utilities/modalUtility/modalUtility.model'
import { HttpErrorResponseUtility, DatePickerUtility } from '../utilities/commonUtility.component'
import { Entry, EntryForCondition, EntryTypeUtility } from '../utilities/entryUtility.component'

declare const $: any;

@Component({
    selector: 'generalJournalComponent',
    templateUrl: './app/generalJournal/generalJournal.html',
    providers: [GeneralJournalService]
}) export class GeneralJournalComponent implements AfterViewInit, AfterViewChecked {
    DatePickerUtility = DatePickerUtility;

    conditionForFilter: EntryForCondition = new EntryForCondition();
    conditionForView: EntryForCondition = new EntryForCondition();

    handsontableId: "handsontableId"
    handsontableGridSettings: Handsontable.GridSettings = GeneralJournalUtility.GetGridSettings(this);

    entrys: Entry[] = [];

    accountingSubjectAutocompleteUtilityModel: AutocompleteUtilityModel = GeneralJournalUtility.GetAccountingSubjectAutocompleteUtilityModel(this);
    bookNameAutocompleteUtilityModel: AutocompleteUtilityModel = GeneralJournalUtility.GetBookNameAutocompleteUtilityModel(this);

    confirmMessageModal: ModalUtilityModel = GeneralJournalUtility.GetConfirmMessageModal(function () { this.filter(true); this.confirmMessageModal.hide(); }.bind(this));
    completeMessageModal: ModalUtilityModel = GeneralJournalUtility.GetCompleteMessageModal();
    errorMessageModal: ModalUtilityModel = new ModalUtilityModel();

    constructor(
        private cdRef: ChangeDetectorRef,
        private generalJournalService: GeneralJournalService) {
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
            if (this.entrys.filter(function (value: Entry, index: number, array: Entry[]) { return value.isEdit }).length > 0) {
                this.confirmMessageModal.show();
                return;
            }
        }

        this.conditionForFilter = this.conditionForView.clone();

        $.blockUI();
        this.generalJournalService.asyncFetchEntryBy(this.conditionForFilter).subscribe(httpResponse => {
            $.unblockUI();
            component.entrys = httpResponse;
            component.entrys.forEach(function (value: Entry, index: number, array: any[]) {
                value.entryTradingDay = moment(value.entryTradingDay).format("YYYY/MM/DD");
                value.entryType = EntryTypeUtility.ToString(value.entryType);
                value.isEdit = false;
            });
        }, httpErrorResponse => { HttpErrorResponseUtility.Handler(httpErrorResponse, this.errorMessageModal); });
    }

    save() {
        var component = this;

        $.blockUI();
        this.generalJournalService.asyncSaveEntryBy(this.conditionForFilter, this.entrys).subscribe(httpResponse => {
            $.unblockUI();
            this.filter(true);
            this.completeMessageModal.show();
        }, httpErrorResponse => { HttpErrorResponseUtility.Handler(httpErrorResponse, this.errorMessageModal); });
    }

    clear() {
        this.conditionForView = new EntryForCondition();

        var entryTradingDayBegin = moment().add(-3, 'M');
        this.conditionForView.entryTradingDayBegin = { date: { year: entryTradingDayBegin.year(), month: entryTradingDayBegin.month() + 1, day: entryTradingDayBegin.date() } };

        var entryTradingDayEnd = moment();
        this.conditionForView.entryTradingDayEnd = { date: { year: entryTradingDayEnd.year(), month: entryTradingDayEnd.month() + 1, day: entryTradingDayEnd.date() } };
    }
}