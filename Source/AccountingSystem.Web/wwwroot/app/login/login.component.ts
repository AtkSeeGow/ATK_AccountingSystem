import { Component } from '@angular/core';

import { LoginService } from './login.service'
import { ModalUtilityModel } from '../utilities/modalUtility/modalUtility.model'
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

    modalUtilityModel: ModalUtilityModel = new ModalUtilityModel();

    constructor(private loginService: LoginService, ) {
        var component = this;

        this.modalUtilityModel.title = "錯誤訊息"
    };

    loginAction() {
        $.blockUI();
        var component = this;

        this.modalUtilityModel.messages = [];

        this.loginService.asyncGenerateToken(this.account, this.password).subscribe(httpResponse => {
            var response = httpResponse;
            window.localStorage.setItem("token", response.token);
            window.location.href = "./GeneralJournal";
        }, httpErrorResponse => { HttpErrorResponseUtility.Handler(httpErrorResponse, this.modalUtilityModel); });
    }
}
