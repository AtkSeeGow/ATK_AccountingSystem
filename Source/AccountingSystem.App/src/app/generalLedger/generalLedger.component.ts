import { Component, AfterViewInit, ChangeDetectorRef, ViewChild, AfterViewChecked } from '@angular/core';

import * as moment from 'moment';
import * as numeral from 'numeral';

import { GeneralLedgerUtility, TotalAmount } from './generalLedger.domain';
import { GeneralLedgerService } from './generalLedger.service';

import { AutocompleteModel } from '../common/autocomplete/autocomplete.model'

import { AccountingSubjectTypeUtility } from '../common/accountingSubject.component'
import { DatePickerUtility } from '../common/utility.component'
import { HttpErrorHandler } from '../common/httpErrorHandler.component'
import { EntryType } from '../common/entry.component'

import { Condition } from '../common/condition.component'

declare const $: any;

@Component({
  selector: 'generalLedgerComponent',
  templateUrl: './generalLedger.html',
  providers: [GeneralLedgerService]
}) export class GeneralLedgerComponent implements AfterViewInit, AfterViewChecked {
  AccountingSubjectTypeUtility = AccountingSubjectTypeUtility;
  DatePickerUtility = DatePickerUtility;
  EntryType = EntryType;

  conditionForView: Condition = new Condition();

  accountingSubjectAutocompleteModel: AutocompleteModel = GeneralLedgerUtility.GetAccountingSubjectAutocompleteModel(this);
  bookNameAutocompleteModel: AutocompleteModel = GeneralLedgerUtility.GetBookNameAutocompleteModel(this);

  ledgers: any[] = [];

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

      let groups = httpResponse.groups;

      component.ledgers = httpResponse.ledgers;
      component.ledgers.forEach(function (keyValuePair: any, index: number, array: any[]) {
        let balanceAmount = 0;

        groups.forEach(function (value: any, index: number, array: any[]) {
          if (value.key === keyValuePair.key.code) {
            balanceAmount = value.value;

            if (AccountingSubjectTypeUtility.IsLogicalDisplayType(keyValuePair.key.type))
              balanceAmount *= -1;
          }
        });

        keyValuePair.value.forEach(function (value: any, index: number, array: any[]) {
          value.tradingDay = moment(value.tradingDay);
          value.entry.amount = numeral(value.entry.amount);

          let amount = value.entry.amount.value();
          if (AccountingSubjectTypeUtility.IsLogicalDisplayType(keyValuePair.key.type))
            amount *= -1;

          if (value.entry.type === EntryType.Debits)
            balanceAmount = balanceAmount + amount;
          else if (value.entry.type === EntryType.Credits)
            balanceAmount = balanceAmount - amount;

          value.balanceAmount = numeral(balanceAmount);
        });

        component.totalAmount.input(keyValuePair.key.type, balanceAmount);
        keyValuePair.key.isExpand = false;
        keyValuePair.key.total = numeral(balanceAmount);
      });
    }, httpErrorResponse => { HttpErrorHandler.Notify(httpErrorResponse); });
  }

  expand(keyValuePair: any) {
    keyValuePair.key.isExpand = !keyValuePair.key.isExpand;
  }

  clear() {
    this.conditionForView = new Condition();

    const tradingDayBegin = moment().add(-3, 'M');
    this.conditionForView.tradingDayBegin = {
      isRange: false, singleDate: {
        date: {
          year: tradingDayBegin.year(),
          month: tradingDayBegin.month() + 1,
          day: tradingDayBegin.date()
        }
      }
    }

    const tradingDayEnd = moment();
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

  filterTotal(ledgers: any[], isTotalZero: boolean): any[] {
    const result: any[] = [];
    ledgers.forEach(function (keyValuePair: any) {
      if (isTotalZero && keyValuePair.key.total.value() === 0)
        result.push(keyValuePair);
      else if (!isTotalZero && keyValuePair.key.total.value() !== 0)
        result.push(keyValuePair);
    });
    return result;
  }
}
