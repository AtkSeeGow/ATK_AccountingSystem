import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

import { EntryTypeUtility } from '../utilities/entryUtility.component';

@Injectable()
export class GeneralLedgerService {
    constructor(
        private http: HttpClient
    ) { };

    asyncSelectBookNameBy(query: any) {
        return this.http.get<any>('Book/SelectNameBy?query=' + query);
    }

    asyncAutocompleteAccountingSubject(query: any) {
        return this.http.get<any>('AccountingSubject/Autocomplete?query=' + query);
    };

    asyncLedgerEntryBy(conditionForFilter: any) {
        conditionForFilter.entryType = EntryTypeUtility.Parse(conditionForFilter.entryType);

        if (conditionForFilter.entryTradingDayBegin && conditionForFilter.entryTradingDayBegin != '')
            conditionForFilter.entryTradingDayBegin = new Date(conditionForFilter.entryTradingDayBegin);

        if (conditionForFilter.entryTradingDayEnd && conditionForFilter.entryTradingDayEnd != '')
            conditionForFilter.entryTradingDayEnd = new Date(conditionForFilter.entryTradingDayEnd);

        return this.http.post<any>('Detail/LedgerBy', conditionForFilter);
    };
}