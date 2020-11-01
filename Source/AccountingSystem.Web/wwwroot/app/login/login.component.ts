import { Component } from '@angular/core';

import { LoginService } from './login.service'
import { HttpErrorResponseUtility } from '../utilities/commonUtility.component'

declare const $: any;
declare const globalConfig: any;

@Component({
    selector: 'loginComponent',
    templateUrl: './app/login/login.html',
    providers: [LoginService]
})
export class LoginComponent {
    account: string = "";
    password: string = "";

    constructor(private loginService: LoginService, ) {
        var component = this;
    };

    loginAction() {
        var component = this;

        this.loginService.asyncGenerateToken(this.account, this.password).subscribe(httpResponse => {
            var response = httpResponse;
            window.localStorage.setItem("token", response.token);
            window.location.href = "./GeneralJournal";
        }, httpErrorResponse => { HttpErrorResponseUtility.Notify(httpErrorResponse); });
    }
}
