import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

import { AccountingSubjectTypeUtility, AccountingSubject } from '../common/accountingSubject.component'

@Injectable()
export class MaintenanceAccountingSubjectService {
  constructor(
    private http: HttpClient
  ) { };

  asyncFetchBy(conditionForFilter: any) {
    conditionForFilter.type = AccountingSubjectTypeUtility.Parse(conditionForFilter.type);
    return this.http.post<any>('Api/AccountingSubject/FetchBy', conditionForFilter);
  };

  asyncSaveBy(conditionForFilter: AccountingSubject, accountingSubjectsForView: AccountingSubject[]) {
    let accountingSubjects: any[] = [];
    accountingSubjectsForView.forEach(function (value: any, index: number, array: any[]) {
      if (value.isEdit != undefined) {
        let accountingSubject: any = AccountingSubject.Clone(value);
        accountingSubject.id = "00000000-0000-0000-0000-000000000000";
        accountingSubject.type = AccountingSubjectTypeUtility.Parse(value.type);
        accountingSubjects.push(accountingSubject);
      }
    });
    return this.http.post<any>('Api/AccountingSubject/SaveBy', { conditionForFilter: conditionForFilter, accountingSubjects: accountingSubjects });
  };
}
