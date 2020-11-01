import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

import { EntryTypeUtility } from '../utilities/entryUtility.component';

@Injectable()
export class IncomeStatementService {
    constructor(
        private http: HttpClient
    ) { }

    asyncSumBy(condition: any) {
        condition.entryType = EntryTypeUtility.Parse(condition.entryType);

        if (condition.entryTradingDayBegin && condition.entryTradingDayBegin != '')
            condition.entryTradingDayBegin = new Date(condition.entryTradingDayBegin);

        if (condition.entryTradingDayEnd && condition.entryTradingDayEnd != '')
            condition.entryTradingDayEnd = new Date(condition.entryTradingDayEnd);

        return this.http.post<any>('Detail/SumBy', condition);
    };
}