import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

@Injectable()
export class BalanceSheetService {
  constructor(
    private http: HttpClient
  ) { };

  asyncTotalBy(condition: any) {
    condition.tradingDayBegin = null;
    return this.http.post<any>('Api/Detail/TotalBy', condition);
  };
}
