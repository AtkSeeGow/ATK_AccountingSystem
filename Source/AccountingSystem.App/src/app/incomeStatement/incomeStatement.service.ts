import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

@Injectable()
export class IncomeStatementService {
  constructor(
    private http: HttpClient
  ) { }

  asyncSumBy(condition: any) {
    return this.http.post<any>('Api/Detail/SumBy', condition);
  };
}
