import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

import { Book } from '../common/book.component';

@Injectable()
export class MaintenanceBookService {
  constructor(
    private http: HttpClient
  ) { };

  asyncSelectNameBy(query: any) {
    return this.http.get<any>('Api/Book/SelectNameBy?query=' + query);
  }

  asyncFetchBy(conditionForFilter: any) {
    return this.http.post<any>('Api/Book/FetchBy', conditionForFilter);
  };

  asyncSaveBy(conditionForFilter: any, booksForView: Book[]) {
    let books: any[] = [];
    booksForView.forEach(function (value: any, index: number, array: any[]) {
      if (value.isEdit != undefined) {
        let book: any = Book.Clone(value);
        book.id = "00000000-0000-0000-0000-000000000000";
        books.push(book);
      }
    });
    return this.http.post<any>('Api/Book/SaveBy', { conditionForFilter: conditionForFilter, books: books });
  };
}
