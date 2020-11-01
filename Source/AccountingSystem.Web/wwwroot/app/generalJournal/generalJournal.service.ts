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

    asyncFetchBy(condition: any) {
        condition.entryType = EntryTypeUtility.Parse(condition.entryType);

        if (condition.entryTradingDayBegin && condition.entryTradingDayBegin !== '')
            condition.entryTradingDayBegin = new Date(condition.entryTradingDayBegin);

        if (condition.entryTradingDayEnd && condition.entryTradingDayEnd !== '')
            condition.entryTradingDayEnd = new Date(condition.entryTradingDayEnd);
        
        return this.http.post<any>('Detail/FetchBy', condition);
    };

    asyncSaveBy(detail: Detail) {
        return this.http.post<any>('Detail/SaveBy', detail);
    };

    asyncDeleteBy(detail: Detail) {
        return this.http.post<any>('Detail/DeleteBy', detail);
    };
}