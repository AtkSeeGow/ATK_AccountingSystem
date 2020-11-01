import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

import { Detail } from '../utilities/detailUtility.component'

@Injectable()
export class ImportService {
    constructor(
        private http: HttpClient
    ) { };

    asyncSavesBy(details: Detail[]) {
        return this.http.post<any>('Detail/SavesBy', details);
    };
}