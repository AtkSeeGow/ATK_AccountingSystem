import { Component } from '@angular/core';

import { LeftBarService } from './leftBar.service'

declare const $: any;
declare const globalConfig: any;

@Component({
    selector: 'leftBarComponent',
    templateUrl: './app/leftBar/leftBar.html',
    providers: [LeftBarService]
})
export class LeftBarComponent {
    globalConfig: any;

    constructor(private leftBarService: LeftBarService) {
        var component = this;
    };

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
        else if (window.location.href.indexOf("GeneralGraph") !== -1) {
            $('#generalGraph').addClass('active');
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
