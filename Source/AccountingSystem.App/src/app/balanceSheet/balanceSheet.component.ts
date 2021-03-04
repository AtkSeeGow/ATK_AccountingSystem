import { Component, AfterViewInit, ChangeDetectorRef, ViewChild, AfterViewChecked } from '@angular/core';

import * as moment from 'moment';
import * as numeral from 'numeral';

import { BalanceSheetService } from './balanceSheet.service'

import { GeneralLedgerUtility } from '../generalLedger/generalLedger.domain'
import { GeneralLedgerService } from '../generalLedger/generalLedger.service'

import { AutocompleteModel } from '../common/autocomplete/autocomplete.model'

import { AccountingSubjectTypeUtility, AccountingSubjectType } from '../common/accountingSubject.component'
import { DatePickerUtility } from '../common/utility.component'
import { HttpErrorHandler } from '../common/httpErrorHandler.component'
import { EntryType } from '../common/entry.component'

import { Condition } from '../common/condition.component'

declare const $: any;

@Component({
  selector: 'balanceSheetComponent',
  templateUrl: './balanceSheet.html',
  styleUrls: ['./balanceSheet.css'],
  providers: [BalanceSheetService, GeneralLedgerService]
}) export class BalanceSheetComponent implements AfterViewInit, AfterViewChecked {
  AccountingSubjectTypeUtility = AccountingSubjectTypeUtility;
  DatePickerUtility = DatePickerUtility;
  EntryType = EntryType;
  AccountingSubjectType = AccountingSubjectType;

  condition: Condition = new Condition();
  conditionForView: Condition = new Condition();

  accountingSubjectAutocompleteModel: AutocompleteModel = GeneralLedgerUtility.GetAccountingSubjectAutocompleteModel(this);
  bookNameAutocompleteModel: AutocompleteModel = GeneralLedgerUtility.GetBookNameAutocompleteModel(this);

  groups: any[] = [];

  currentAssets: any[] = [];
  nonCurrentAssets: any[] = [];
  otherAssets: any[] = [];

  currentLiabilities: any[] = [];
  nonCurrentLiabilities: any[] = [];
  otherLiabilities: any[] = [];

  ownerEquitys: any[] = [];
  unprocessed: any[] = []

  constructor(
    private cdRef: ChangeDetectorRef,
    private balanceSheetService: BalanceSheetService,
    private generalLedgerService: GeneralLedgerService
  ) {
    this.clear();
    this.condition = this.conditionForView.clone();
    this.filter();
  }

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }

  ngAfterViewInit() {
  };

  filter() {
    const component = this;

    this.groups = [];
    this.currentAssets = [];
    this.nonCurrentAssets = [];
    this.otherAssets = [];
    this.currentLiabilities = [];
    this.nonCurrentLiabilities = [];
    this.otherLiabilities = [];
    this.ownerEquitys = [];

    this.condition = this.conditionForView.clone();

    const notify = $.notify({ icon: "tim-icons icon-bell-55", message: "Please Wait" }, { type: 'info', delay: 0, placement: { from: 'top', align: 'right' } });

    this.balanceSheetService.asyncTotalBy(this.condition).subscribe(httpResponse => {
      notify.close();

      component.condition.tradingDayEnd = moment(component.condition.tradingDayEnd);

      component.groups = httpResponse;
      component.groups.forEach(function (keyValuePair: any, index: number, array: any[]) {
        if (keyValuePair.key.type === AccountingSubjectType.Assets) {
          if (keyValuePair.key.code.substring(0, 3) === "110")
            component.currentAssets.push(keyValuePair);
          else if (keyValuePair.key.code.substring(0, 3) === "120")
            component.nonCurrentAssets.push(keyValuePair);
          else
            component.otherAssets.push(keyValuePair);
        }
        else if (keyValuePair.key.type === AccountingSubjectType.Liabilities) {
          keyValuePair.value = keyValuePair.value * -1;
          if (keyValuePair.key.code.substring(0, 3) === "210")
            component.currentLiabilities.push(keyValuePair);
          else if (keyValuePair.key.code.substring(0, 3) === "220")
            component.nonCurrentLiabilities.push(keyValuePair);
          else
            component.otherLiabilities.push(keyValuePair);
        }
        else if (keyValuePair.key.type === AccountingSubjectType.OwnerEquity) {
          keyValuePair.value = keyValuePair.value * -1;
          component.ownerEquitys.push(keyValuePair);
        }
        keyValuePair.value = numeral(keyValuePair.value);
      });
    }, httpErrorResponse => { HttpErrorHandler.Notify(httpErrorResponse); });
  }

  sum(items: any[]) {
    let result = 0;
    items.forEach(function (keyValuePair: any, index: number, array: any[]) {
      result = result + keyValuePair.value.value();
    });
    return numeral(result);
  }

  total(accountingSubjectType: AccountingSubjectType) {
    let result = 0;
    this.groups.forEach(function (keyValuePair: any, index: number, array: any[]) {
      if (keyValuePair.key.type === accountingSubjectType) {
        result = result + keyValuePair.value.value();
      }
    });
    return numeral(result);
  }

  aggregate() {
    let result = this.total(AccountingSubjectType.Liabilities).value() + this.total(AccountingSubjectType.OwnerEquity).value();
    return numeral(result);
  }

  clear() {
    this.conditionForView = new Condition();
    
    const now = moment();
    this.conditionForView.tradingDayBegin = {
      isRange: false, singleDate: {
        date: {
          year: now.year(),
          month: 1,
          day: 1
        }
      }
    }

    this.conditionForView.tradingDayEnd = {
      isRange: false, singleDate: {
        date: {
          year: now.year(),
          month: 12,
          day: 31
        }
      }
    }
  }
}
