import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

import { Book } from '../utilities/bookUtility.component';

@Injectable()
export class MaintenanceBookService {
    constructor(
        private http: HttpClient
    ) { };

    asyncSelectBookNameBy(query: any) {
        return this.http.get<any>('Book/SelectNameBy?query=' + query);
    }

    asyncFetchBookBy(conditionForFilter: any) {
        return this.http.post<any>('Book/FetchBy', conditionForFilter);
    };

    asyncSaveBookBy(conditionForFilter: any, booksForView: Book[]) {
        let entrys: any[] = [];
        booksForView.forEach(function (value: any, index: number, array: any[]) {
            if (value.isEdit != undefined) {
                let entry: any = Book.Clone(value);
                entry.id = "00000000-0000-0000-0000-000000000000";
                entrys.push(entry);
            }
        });
        return this.http.post<any>('Book/SaveBy', { conditionForFilter: conditionForFilter, books: entrys });
    };
}