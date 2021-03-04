import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

import { Detail } from '../common/detail.component'

@Injectable()
export class ImportService {
  constructor(
    private http: HttpClient
  ) { };

  asyncSavesBy(details: Detail[]) {
    return this.http.post<any>('Api/Detail/SavesBy', details);
  };
}
