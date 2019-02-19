import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

@Injectable()
export class LoginService {
    constructor(
        private http: HttpClient
    ) { };

    asyncGenerateToken(account: string, password: string) {
        return this.http.post<any>('Login/GenerateToken', { 'account': account, 'password': password });
    };
}