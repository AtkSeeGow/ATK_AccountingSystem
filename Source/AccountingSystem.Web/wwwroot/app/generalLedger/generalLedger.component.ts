import { Component, AfterViewInit, ChangeDetectorRef, ViewChild, AfterViewChecked } from '@angular/core';

import * as moment from 'moment';
import * as numeral from 'numeral';

import { GeneralLedgerUtility, TotalAmount } from './generalLedger.domain';
import { GeneralLedgerService } from './generalLedger.service';

import { AutocompleteUtilityModel } from '../utilities/autocompleteUtility/autocompleteUtility.model'
import { ModalUtilityModel } from '../utilities/modalUtility/modalUtility.model'

import { AccountingSubjectTypeUtility } from '../utilities/accountingSubjectUtility.component'
import { HttpErrorResponseUtility, DatePickerUtility } from '../utilities/commonUtility.component'
import { EntryType } from '../utilities/entryUtility.component'

import { Condition } from '../utilities/conditionUtility.component'

declare const $: any;

@Component({
    selector: 'generalLedgerComponent',
    templateUrl: './app/generalLedger/generalLedger.html',
    providers: [GeneralLedgerService]
}) export class GeneralLedgerComponent implements AfterViewInit, AfterViewChecked {
    AccountingSubjectTypeUtility = AccountingSubjectTypeUtility;
    DatePickerUtility = DatePickerUtility;
    EntryType = EntryType;

    conditionForView: Condition = new Condition();

    accountingSubjectAutocompleteUtilityModel: AutocompleteUtilityModel = GeneralLedgerUtility.GetAccountingSubjectAutocompleteUtilityModel(this);
    bookNameAutocompleteUtilityModel: AutocompleteUtilityModel = GeneralLedgerUtility.GetBookNameAutocompleteUtilityModel(this);

    ledgers: any[] = [];

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
        const component = this;

        const condition = this.conditionForView.clone();

        const notify = $.notify({ icon: "tim-icons icon-bell-55", message: "Please Wait" }, { type: 'info', delay: 0, placement: { from: 'top', align: 'right' } });

        this.generalLedgerService.asyncLedgerEntryBy(condition).subscribe(httpResponse => {
            notify.close();

            component.totalAmount = new TotalAmount();

            component.ledgers = httpResponse;
            component.ledgers.forEach(function (keyValuePair: any, index: number, array: any[]) {
                let balanceAmount = 0;
                keyValuePair.value.forEach(function (value: any, index: number, array: any[]) {
                    value.tradingDay = moment(value.tradingDay);
                    const amount = value.entry.amount = numeral(value.entry.amount);

                    if (value.entry.type === EntryType.Debits)
                        balanceAmount = balanceAmount + amount.value();
                    else if (value.entry.type === EntryType.Credits)
                        balanceAmount = balanceAmount - amount.value();

                    value.balanceAmount = numeral(balanceAmount);
                });

                component.totalAmount.input(keyValuePair.key.type, balanceAmount);
                keyValuePair.key.isExpand = false;
                keyValuePair.key.total = numeral(balanceAmount);
            });
        }, httpErrorResponse => { HttpErrorResponseUtility.Notify(httpErrorResponse); });
    }

    expand(keyValuePair: any) {
        keyValuePair.key.isExpand = !keyValuePair.key.isExpand;
    }

    clear() {
        this.conditionForView = new Condition();

        const tradingDayBegin = moment().add(-3, 'M');
        this.conditionForView.tradingDayBegin = { date: { year: tradingDayBegin.year(), month: tradingDayBegin.month() + 1, day: tradingDayBegin.date() } };

        const tradingDayEnd = moment();
        this.conditionForView.tradingDayEnd = { date: { year: tradingDayEnd.year(), month: tradingDayEnd.month() + 1, day: tradingDayEnd.date() } };
    }
}