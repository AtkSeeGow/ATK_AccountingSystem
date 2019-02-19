import { Component, AfterViewInit, ChangeDetectorRef, ViewChild, AfterViewChecked } from '@angular/core';

import * as moment from 'moment';
import * as numeral from 'numeral';

import { GeneralLedgerUtility, TotalAmount } from './generalLedger.domain';
import { GeneralLedgerService } from './generalLedger.service';

import { AutocompleteUtilityModel } from '../utilities/autocompleteUtility/autocompleteUtility.model'
import { ModalUtilityModel, Button } from '../utilities/modalUtility/modalUtility.model'

import { AccountingSubjectType, AccountingSubjectTypeUtility } from '../utilities/accountingSubjectUtility.component'
import { HttpErrorResponseUtility, DatePickerUtility } from '../utilities/commonUtility.component'
import { EntryType, EntryForCondition } from '../utilities/entryUtility.component'

declare const $: any;

@Component({
    selector: 'generalLedgerComponent',
    templateUrl: './app/generalLedger/generalLedger.html',
    providers: [GeneralLedgerService]
}) export class GeneralLedgerComponent implements AfterViewInit, AfterViewChecked {
    AccountingSubjectTypeUtility = AccountingSubjectTypeUtility;
    DatePickerUtility = DatePickerUtility;
    EntryType = EntryType;

    conditionForFilter: EntryForCondition = new EntryForCondition();
    conditionForView: EntryForCondition = new EntryForCondition();

    accountingSubjectAutocompleteUtilityModel: AutocompleteUtilityModel = GeneralLedgerUtility.GetAccountingSubjectAutocompleteUtilityModel(this);
    bookNameAutocompleteUtilityModel: AutocompleteUtilityModel = GeneralLedgerUtility.GetBookNameAutocompleteUtilityModel(this);

    ledgers: any[] = [];

    confirmMessageModal: ModalUtilityModel = GeneralLedgerUtility.GetConfirmMessageModal(function () { this.filter(true); this.confirmMessageModal.hide(); }.bind(this));
    completeMessageModal: ModalUtilityModel = GeneralLedgerUtility.GetCompleteMessageModal();
    errorMessageModal: ModalUtilityModel = new ModalUtilityModel();

    totalAmount: TotalAmount = new TotalAmount();

    constructor(
        private cdRef: ChangeDetectorRef,
        private generalLedgerService: GeneralLedgerService) {
    }

    ngAfterViewChecked() {
        this.cdRef.detectChanges();
    }

    ngAfterViewInit() {
        this.clear();
        this.filter();
    };

    filter() {
        var component = this;
        this.conditionForFilter = this.conditionForView.clone();

        $.blockUI();
        this.generalLedgerService.asyncLedgerEntryBy(this.conditionForFilter).subscribe(httpResponse => {
            $.unblockUI();

            component.totalAmount = new TotalAmount();

            component.ledgers = httpResponse;
            component.ledgers.forEach(function (keyValuePair: any, index: number, array: any[]) {
                var balanceAmount = 0;
                keyValuePair.value.forEach(function (value: any, index: number, array: any[]) {
                    value.entryTradingDay = moment(value.entryTradingDay);
                    value.entryAmount = numeral(value.entryAmount);

                    if (value.entryType == EntryType.Debits)
                        balanceAmount = balanceAmount + value.entryAmount.value();
                    else if (value.entryType == EntryType.Credits)
                        balanceAmount = balanceAmount - value.entryAmount.value();

                    value.balanceAmount = numeral(balanceAmount);
                });
                component.totalAmount.input(keyValuePair.key.accountingSubjectType, balanceAmount);
            });
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