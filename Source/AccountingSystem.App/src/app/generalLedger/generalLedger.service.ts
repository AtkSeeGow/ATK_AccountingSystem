import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

@Injectable()
export class GeneralLedgerService {
  constructor(
    private http: HttpClient
  ) { };

  asyncSelectBookNameBy(query: any) {
    return this.http.get<any>('Api/Book/SelectNameBy?query=' + query);
  }

  asyncAutocompleteAccountingSubject(query: any) {
    return this.http.get<any>('Api/AccountingSubject/Autocomplete?query=' + query);
  };

  asyncLedgerEntryBy(condition: any) {
    return this.http.post<any>('Api/Detail/LedgerBy', condition);
  };
}
