import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

import { Detail } from '../utilities/detailUtility.component';
import { Entry, EntryTypeUtility } from '../utilities/entryUtility.component';

@Injectable()
export class GeneralJournalService {
    constructor(
        private http: HttpClient
    ) { };

    asyncSelectBookNameBy(query: any) {
        return this.http.get<any>('Book/SelectNameBy?query=' + query);
    }

    asyncAutocompleteAccountingSubject(query: any) {
        return this.http.get<any>('AccountingSubject/Autocomplete?query=' + query);
    };

    asyncFetchEntryBy(conditionForFilter: any) {
        conditionForFilter.entryType = EntryTypeUtility.Parse(conditionForFilter.entryType);

        if (conditionForFilter.entryTradingDayBegin && conditionForFilter.entryTradingDayBegin != '')
            conditionForFilter.entryTradingDayBegin = new Date(conditionForFilter.entryTradingDayBegin);

        if (conditionForFilter.entryTradingDayEnd && conditionForFilter.entryTradingDayEnd != '')
            conditionForFilter.entryTradingDayEnd = new Date(conditionForFilter.entryTradingDayEnd);
        
        return this.http.post<any>('Detail/FetchBy', conditionForFilter);
    };

    asyncSaveBy(detail: Detail) {
        return this.http.post<any>('Detail/SaveBy', detail);
    };

    asyncDeleteBy(detail: Detail) {
        return this.http.post<any>('Detail/DeleteBy', detail);
    };
}