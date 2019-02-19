import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

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
        
        return this.http.post<any>('Entry/FetchBy', conditionForFilter);
    };

    asyncSaveEntryBy(conditionForFilter: any, entrysForView: Entry[]) {
        let entrys: any[] = [];
        entrysForView.forEach(function (value: any, index: number, array: any[]) {
            if (value.isEdit != undefined) {
                let entry: any = Entry.Clone(value);

                entry.id = "00000000-0000-0000-0000-000000000000";
                entry.entryType = EntryTypeUtility.Parse(value.entryType);

                if (entry.entryBookName == null)
                    entry.entryBookName = "";

                if (entry.entrySummary == null)
                    entry.entrySummary = "";

                if (entry.entryAccountingSubject != null) {
                    var openParenthesisIndex = entry.entryAccountingSubject.indexOf('(');
                    if (openParenthesisIndex != -1)
                        entry.entryAccountingSubject = entry.entryAccountingSubject.substring(0, openParenthesisIndex);
                }
                
                entrys.push(entry);
            }
        });
        return this.http.post<any>('Entry/SaveBy', { conditionForFilter: conditionForFilter, entrys: entrys });
    };
}