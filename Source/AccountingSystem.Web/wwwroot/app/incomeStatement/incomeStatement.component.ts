import { Component, AfterViewInit, ChangeDetectorRef, ViewChild, AfterViewChecked } from '@angular/core';

import * as moment from 'moment';
import * as numeral from 'numeral';

import { IncomeStatementService } from './incomeStatement.service'

import { GeneralLedgerUtility } from '../generalLedger/generalLedger.domain'
import { GeneralLedgerService } from '../generalLedger/generalLedger.service'

import { AutocompleteUtilityModel } from '../utilities/autocompleteUtility/autocompleteUtility.model'

import { AccountingSubjectTypeUtility, AccountingSubjectType } from '../utilities/accountingSubjectUtility.component'
import { HttpErrorResponseUtility, DatePickerUtility } from '../utilities/commonUtility.component'
import { EntryType } from '../utilities/entryUtility.component'

import { Condition } from '../utilities/conditionUtility.component'

declare const $: any;

@Component({
    selector: 'incomeStatementComponent',
    templateUrl: './app/incomeStatement/incomeStatement.html',
    providers: [IncomeStatementService, GeneralLedgerService]
}) export class IncomeStatementComponent implements AfterViewInit, AfterViewChecked {
    AccountingSubjectTypeUtility = AccountingSubjectTypeUtility;
    DatePickerUtility = DatePickerUtility;
    EntryType = EntryType;
    AccountingSubjectType = AccountingSubjectType;

    condition: Condition = new Condition();
    conditionForView: Condition = new Condition();

    years: number[] = [];
    groups: any[] = [];

    operatingIncomes: any[] = [];
    nonOperatingIncomes: any[] = [];
    operatingCosts: any[] = [];
    nonOperatingCosts: any[] = [];

    accountingSubjectAutocompleteUtilityModel: AutocompleteUtilityModel = GeneralLedgerUtility.GetAccountingSubjectAutocompleteUtilityModel(this);
    bookNameAutocompleteUtilityModel: AutocompleteUtilityModel = GeneralLedgerUtility.GetBookNameAutocompleteUtilityModel(this);

    constructor(
        private cdRef: ChangeDetectorRef,
        private incomeStatementService: IncomeStatementService,
        private generalLedgerService: GeneralLedgerService) {
        this.clear();
        this.condition = this.conditionForView.clone();
        this.filter();
    }

    ngAfterViewChecked() {
        this.cdRef.detectChanges();
    }

    ngAfterViewInit() {
    }

    filter() {
        const component = this;

        this.condition = this.conditionForView.clone();

        this.years = [];
        this.groups = [];
        this.operatingIncomes = [];
        this.nonOperatingIncomes = [];
        this.operatingCosts = [];
        this.nonOperatingCosts = [];

        const notify = $.notify({ icon: "tim-icons icon-bell-55", message: "Please Wait" }, { type: 'info', delay: 0, placement: { from: 'top', align: 'right' } });

        this.incomeStatementService.asyncSumBy(this.condition).subscribe(httpResponse => {
            notify.close();
            component.years = httpResponse.years;
            component.groups = httpResponse.target;
            component.groups.forEach(function (keyValuePair: any, index: number, array: any[]) {
                if (keyValuePair.key.type === AccountingSubjectType.Revenues) {
                    keyValuePair.value.forEach(function (value: any, index: number, array: any[]) {
                        value.value  = value.value * -1;
                    });
                    if (keyValuePair.key.code.substring(0, 3) === "410")
                        component.operatingIncomes.push(keyValuePair);
                    else
                        component.nonOperatingIncomes.push(keyValuePair);
                }
                else if (keyValuePair.key.type === AccountingSubjectType.Expenses) {
                    if (keyValuePair.key.code.substring(0, 3) === "510")
                        component.operatingCosts.push(keyValuePair);
                    else
                        component.nonOperatingCosts.push(keyValuePair);
                }
                keyValuePair.value.forEach(function (value: any, index: number, array: any[]) {
                    value.value = numeral(value.value);
                });
            });
        }, httpErrorResponse => { HttpErrorResponseUtility.Notify(httpErrorResponse); });
    }

    get(year: number, keyValuePair: any) {
        var result = numeral(0);
        var yearAmountPairs = keyValuePair.value;
        yearAmountPairs.forEach(function (yearAmountPair: any, index: number, array: any[]) {
            if (yearAmountPair.key === year)
                result = yearAmountPair.value;
        });
        return result;
    }

    proportion(x: any, y: any) {
        var amount = x.value();
        var total = y.value();

        if (amount == 0 || total == 0)
            return "";

        var result = amount / total * 100;
        return result.toFixed(2) + "%";
    }

    sum(year: number, keyValuePairs: any[]) {
        let result = 0;
        keyValuePairs.forEach(function (keyValuePair: any, index: number, array: any[]) {
            var yearAmountPairs = keyValuePair.value;
            yearAmountPairs.forEach(function (yearAmountPair: any, index: number, array: any[]) {
                if (yearAmountPair.key === year)
                    result = result + yearAmountPair.value.value();
            });
        });
        return numeral(result);
    }

    total(year: number, accountingSubjectType: AccountingSubjectType) {
        const component = this;

        var result = 0;
        this.groups.forEach(function (keyValuePair: any, index: number, array: any[]) {
            if (keyValuePair.key.type === accountingSubjectType) {
                result = result + component.get(year, keyValuePair).value();
            }
        });
        return numeral(result);
    }

    netLossPeriod(year: number) {
        var result = this.total(year, AccountingSubjectType.Revenues).value() - this.total(year, AccountingSubjectType.Expenses).value();
        return numeral(result);
    }

    clear() {
        this.conditionForView = new Condition();

        const tradingDayBegin = moment();
        this.conditionForView.tradingDayBegin = { date: { year: tradingDayBegin.add(-3, 'year').year(), month: 1, day: 1 } };

        const tradingDayEnd = moment();
        this.conditionForView.tradingDayEnd = { date: { year: tradingDayEnd.year(), month: 12, day: 31 } };
    }
}