import { Component, AfterViewInit, AfterViewChecked, NgModule } from '@angular/core';

declare const $: any;

@Component({
  selector: 'layout',
  templateUrl: './layout.html',
  styleUrls: ['./layout.css']
})
export class LayoutComponent implements AfterViewInit {

  constructor() { }

  ngAfterViewInit() {
    if (window.location.href.indexOf("GeneralJournal") !== -1) {
      $('#generalJournal').addClass('active');
    }
    else if (window.location.href.indexOf("Import") !== -1) {
      $('#import').addClass('active');
    }
    else if (window.location.href.indexOf("GeneralLedger") !== -1) {
      $('#generalLedger').addClass('active');
    }
    else if (window.location.href.indexOf("BalanceSheet") !== -1) {
      $('#balanceSheet').addClass('active');
    }
    else if (window.location.href.indexOf("IncomeStatement") !== -1) {
      $('#incomeStatement').addClass('active');
    }
    else if (window.location.href.indexOf("MaintenanceAccountingSubject") !== -1) {
      $('#maintenanceAccountingSubject').addClass('active');
    }
    else if (window.location.href.indexOf("MaintenanceBook") !== -1) {
      $('#maintenanceBook').addClass('active');
    }
    else {
      $('#generalJournal').addClass('active');
    }
  }
}
