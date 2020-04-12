import { Component, AfterViewInit, ChangeDetectorRef, ViewChild, AfterViewChecked } from '@angular/core';

import * as moment from 'moment';
import * as numeral from 'numeral';

import { GeneralGraphUtility } from './generalGraph.domain';
import { GeneralGraphService } from './generalGraph.service';

import { AutocompleteUtilityModel } from '../utilities/autocompleteUtility/autocompleteUtility.model'
import { ModalUtilityModel } from '../utilities/modalUtility/modalUtility.model'

import { AccountingSubjectTypeUtility } from '../utilities/accountingSubjectUtility.component'
import { HttpErrorResponseUtility, DatePickerUtility } from '../utilities/commonUtility.component'
import { EntryType, EntryForCondition } from '../utilities/entryUtility.component'

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

    conditionForFilter: EntryForCondition = new EntryForCondition();
    conditionForView: EntryForCondition = new EntryForCondition();

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

    change(name: string, value: any) {
        if (name == 'isByMonth') {
            this.conditionForView.entryIsByMonth = value;
            this.conditionForView.entryIsByYear = !value;
        }
            
        if (name == 'isByYear') {
            this.conditionForView.entryIsByYear = value;
            this.conditionForView.entryIsByMonth = !value;
        }  
    }

    filter() {
        var component = this;
        this.conditionForFilter = this.conditionForView.clone();

        $.blockUI();
        this.generalGraphService.asyncGraphEntryBy(this.conditionForFilter).subscribe(httpResponse => {
            $.unblockUI();

            var assets = httpResponse.Assets;
            var liabilities = httpResponse.Liabilities;
            var revenues = httpResponse.Revenues;
            var expenses = httpResponse.Expenses;

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

        }, httpErrorResponse => { HttpErrorResponseUtility.Handler(httpErrorResponse, this.errorMessageModal); });
    }

    clear() {
        this.conditionForView = new EntryForCondition();
        this.conditionForView.entryIsByMonth = true;

        var entryTradingDayBegin = moment().add(-3, 'M');
        this.conditionForView.entryTradingDayBegin = { date: { year: entryTradingDayBegin.year(), month: entryTradingDayBegin.month() + 1, day: entryTradingDayBegin.date() } };

        var entryTradingDayEnd = moment();
        this.conditionForView.entryTradingDayEnd = { date: { year: entryTradingDayEnd.year(), month: entryTradingDayEnd.month() + 1, day: entryTradingDayEnd.date() } };
    }
}