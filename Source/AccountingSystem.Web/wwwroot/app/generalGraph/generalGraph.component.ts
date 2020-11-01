import { Component, AfterViewInit, ChangeDetectorRef, ViewChild, AfterViewChecked } from '@angular/core';

import * as moment from 'moment';

import { GeneralGraphUtility } from './generalGraph.domain';
import { GeneralGraphService } from './generalGraph.service';

import { AutocompleteUtilityModel } from '../utilities/autocompleteUtility/autocompleteUtility.model'
import { ModalUtilityModel } from '../utilities/modalUtility/modalUtility.model'

import { AccountingSubjectTypeUtility } from '../utilities/accountingSubjectUtility.component'
import { HttpErrorResponseUtility, DatePickerUtility } from '../utilities/commonUtility.component'
import { EntryType } from '../utilities/entryUtility.component'

import { Condition } from '../utilities/conditionUtility.component'

declare const $: any;
declare const Morris: any;

@Component({
    selector: 'generalGraphComponent',
    templateUrl: './app/generalGraph/generalGraph.html',
    providers: [GeneralGraphService]
}) export class GeneralGraphComponent implements AfterViewInit, AfterViewChecked {
    AccountingSubjectTypeUtility = AccountingSubjectTypeUtility;
    DatePickerUtility = DatePickerUtility;
    EntryType = EntryType;

    conditionForView: Condition = new Condition();

    accountingSubjectAutocompleteUtilityModel: AutocompleteUtilityModel = GeneralGraphUtility.GetAccountingSubjectAutocompleteUtilityModel(this);
    bookNameAutocompleteUtilityModel: AutocompleteUtilityModel = GeneralGraphUtility.GetBookNameAutocompleteUtilityModel(this);

    errorMessageModal: ModalUtilityModel = new ModalUtilityModel();

    constructor(
        private cdRef: ChangeDetectorRef,
        private generalGraphService: GeneralGraphService) {
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

        const condition = this.conditionForView.clone();

        const notify = $.notify({ icon: "tim-icons icon-bell-55", message: "Please Wait" }, { type: 'info', delay: 0, placement: { from: 'top', align: 'right' } });

        this.generalGraphService.asyncGraphEntryBy(condition).subscribe(httpResponse => {
            notify.close();

            const assets = httpResponse.Assets;
            const liabilities = httpResponse.Liabilities;
            const revenues = httpResponse.Revenues;
            const expenses = httpResponse.Expenses;

            liabilities.forEach(function (item: any) {
                item.value *= -1;
            });

            revenues.forEach(function (item: any) {
                item.value *= -1;
            });

            $('#assets-container').html('');
            new Morris.Line({
                element: 'assets-container',
                data: assets,
                xkey: 'date',
                ykeys: ['value'],
                labels: ['value']
            });

            $('#liabilities-container').html('');
            new Morris.Line({
                element: 'liabilities-container',
                data: liabilities,
                xkey: 'date',
                ykeys: ['value'],
                labels: ['value']
            });

            $('#revenues-container').html('');
            new Morris.Bar({
                element: 'revenues-container',
                data: revenues,
                xkey: 'date',
                ykeys: ['value'],
                labels: ['value']
            });

            $('#expenses-container').html('');
            new Morris.Bar({
                element: 'expenses-container',
                data: expenses,
                xkey: 'date',
                ykeys: ['value'],
                labels: ['value']
            });

        }, httpErrorResponse => { HttpErrorResponseUtility.Notify(httpErrorResponse); });
    }

    clear() {
        this.conditionForView = new Condition();

        const tradingDayBegin = moment().add(-3, 'M');
        this.conditionForView.tradingDayBegin = { date: { year: tradingDayBegin.year(), month: tradingDayBegin.month() + 1, day: tradingDayBegin.date() } };

        const tradingDayEnd = moment();
        this.conditionForView.tradingDayEnd = { date: { year: tradingDayEnd.year(), month: tradingDayEnd.month() + 1, day: tradingDayEnd.date() } };
    }
}