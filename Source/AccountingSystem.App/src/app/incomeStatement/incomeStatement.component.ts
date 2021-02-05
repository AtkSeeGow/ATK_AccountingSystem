import { Component, AfterViewInit, ChangeDetectorRef, ViewChild, AfterViewChecked } from '@angular/core';

import * as moment from 'moment';
import * as numeral from 'numeral';

import { IncomeStatementService } from './incomeStatement.service'

import { GeneralLedgerService } from '../generalLedger/generalLedger.service'

import { AccountingSubjectTypeUtility, AccountingSubjectType } from '../common/accountingSubject.component'
import { DatePickerUtility } from '../common/utility.component'
import { HttpErrorHandler } from '../common/httpErrorHandler.component'
import { EntryType } from '../common/entry.component'

import { Condition } from '../common/condition.component'

declare const $: any;
declare const Morris: any;

@Component({
  selector: 'incomeStatementComponent',
  templateUrl: './incomeStatement.html',
  styleUrls: ['./incomeStatement.css'],
  providers: [IncomeStatementService, GeneralLedgerService]
}) export class IncomeStatementComponent implements AfterViewInit, AfterViewChecked {
  AccountingSubjectTypeUtility = AccountingSubjectTypeUtility;
  DatePickerUtility = DatePickerUtility;
  EntryType = EntryType;
  AccountingSubjectType = AccountingSubjectType;

  condition: Condition = new Condition();
  conditionForView: Condition = new Condition();

  keys: number[] = [];
  groups: any[] = [];

  graph: any[] = [];
  operatingIncomes: any[] = [];
  nonOperatingIncomes: any[] = [];
  operatingCosts: any[] = [];
  nonOperatingCosts: any[] = [];

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

    this.keys = [];
    this.groups = [];
    this.graph = [];
    this.operatingIncomes = [];
    this.nonOperatingIncomes = [];
    this.operatingCosts = [];
    this.nonOperatingCosts = [];

    const notify = $.notify({ icon: "tim-icons icon-bell-55", message: "Please Wait" }, { type: 'info', delay: 0, placement: { from: 'top', align: 'right' } });

    this.incomeStatementService.asyncSumBy(this.condition).subscribe(httpResponse => {
      notify.close();
      component.keys = httpResponse.keys;
      component.groups = httpResponse.target;

      component.groups.forEach(function (keyValuePair: any, index: number, array: any[]) {
        if (keyValuePair.key.type === AccountingSubjectType.Revenues) {
          keyValuePair.value.forEach(function (value: any, index: number, array: any[]) {
            value.value = value.value * -1;
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

      component.keys.forEach(function (key: any, index: number, array: any[]) {
        component.graph.push({ 
          key: key, 
          revenues: component.total(key, AccountingSubjectType.Revenues).value(), 
          expenses: component.total(key, AccountingSubjectType.Expenses).value()})
      });

      $('#graph').html('');
      new Morris.Bar({
        element: 'graph',
        data: component.graph,
        xkey: 'key',
        ykeys: ['revenues', 'expenses'],
        labels:  ['revenues', 'expenses']
      });
    }, httpErrorResponse => { HttpErrorHandler.Notify(httpErrorResponse); });
  }

  get(key: number, keyValuePair: any) {
    var result = numeral(0);
    var keyAmountPairs = keyValuePair.value;
    keyAmountPairs.forEach(function (keyAmountPair: any, index: number, array: any[]) {
      if (keyAmountPair.key === key)
        result = keyAmountPair.value;
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

  sum(key: number, keyValuePairs: any[]) {
    let result = 0;
    keyValuePairs.forEach(function (keyValuePair: any, index: number, array: any[]) {
      var keyAmountPairs = keyValuePair.value;
      keyAmountPairs.forEach(function (keyAmountPair: any, index: number, array: any[]) {
        if (keyAmountPair.key === key)
          result = result + keyAmountPair.value.value();
      });
    });
    return numeral(result);
  }

  total(key: number, accountingSubjectType: AccountingSubjectType) {
    const component = this;

    var result = 0;
    this.groups.forEach(function (keyValuePair: any, index: number, array: any[]) {
      if (keyValuePair.key.type === accountingSubjectType) {
        result = result + component.get(key, keyValuePair).value();
      }
    });
    return numeral(result);
  }

  netLossPeriod(key: number) {
    var result = this.total(key, AccountingSubjectType.Revenues).value() - this.total(key, AccountingSubjectType.Expenses).value();
    return numeral(result);
  }

  clear() {
    this.conditionForView = new Condition();
    this.conditionForView.monthInterval = 1;

    const tradingDayBegin = moment().add(-1, 'year');
    this.conditionForView.tradingDayBegin = {
      isRange: false, singleDate: {
        date: {
          year: tradingDayBegin.year(),
          month: tradingDayBegin.month() + 1,
          day: 1
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
}
