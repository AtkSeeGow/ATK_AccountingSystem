import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

import { Detail } from '../common/detail.component';
import { EntryTypeUtility } from '../common/entry.component';

@Injectable()
export class GeneralJournalService {
  constructor(
    private http: HttpClient
  ) { };

  asyncSelectBookNameBy(query: any) {
    return this.http.get<any>('Api/Book/SelectNameBy?query=' + query);
  }

  asyncAutocompleteAccountingSubject(query: any) {
    return this.http.get<any>('Api/AccountingSubject/Autocomplete?query=' + query);
  };

  asyncFetchBy(condition: any) {
    condition.entryType = EntryTypeUtility.Parse(condition.entryType);

    if (condition.entryTradingDayBegin && condition.entryTradingDayBegin !== '')
      condition.entryTradingDayBegin = new Date(condition.entryTradingDayBegin);

    if (condition.entryTradingDayEnd && condition.entryTradingDayEnd !== '')
      condition.entryTradingDayEnd = new Date(condition.entryTradingDayEnd);

    return this.http.post<any>('Api/Detail/FetchBy', condition);
  };

  asyncSaveBy(detail: Detail) {
    return this.http.post<any>('Api/Detail/SaveBy', detail);
  };

  asyncDeleteBy(detail: Detail) {
    return this.http.post<any>('Api/Detail/DeleteBy', detail);
  };
}
