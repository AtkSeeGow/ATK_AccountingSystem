import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

@Injectable()
export class LeftBarService {

    constructor(
        private http: HttpClient
    ) { };

    asyncGetMessages() {
        return this.http.get("https://angular-http-guide.firebaseio.com/courses.json");
    };
}