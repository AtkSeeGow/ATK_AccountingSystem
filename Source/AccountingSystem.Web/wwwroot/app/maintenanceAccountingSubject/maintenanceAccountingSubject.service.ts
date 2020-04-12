import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

import { AccountingSubjectTypeUtility, AccountingSubject } from '../utilities/accountingSubjectUtility.component'

@Injectable()
export class MaintenanceAccountingSubjectService {
    constructor(
        private http: HttpClient
    ) { };

    asyncFetchAccountingSubjectBy(conditionForFilter: any) {
        conditionForFilter.accountingSubjectType = AccountingSubjectTypeUtility.Parse(conditionForFilter.accountingSubjectType);
        return this.http.post<any>('AccountingSubject/FetchBy', conditionForFilter);
    };

    asyncSaveAccountingSubjectBy(conditionForFilter: AccountingSubject, accountingSubjectsForView: AccountingSubject[]) {
        let accountingSubjects: any[] = [];
        accountingSubjectsForView.forEach(function (value: any, index: number, array: any[]) {
            if (value.isEdit != undefined) {
                let accountingSubject: any = AccountingSubject.Clone(value);
                accountingSubject.id = "00000000-0000-0000-0000-000000000000";
                accountingSubject.accountingSubjectType = AccountingSubjectTypeUtility.Parse(value.accountingSubjectType);
                accountingSubjects.push(accountingSubject);
            }
        });
        return this.http.post<any>('AccountingSubject/SaveBy', { conditionForFilter: conditionForFilter, accountingSubjects: accountingSubjects});
    };
}