import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { LoginComponent } from './login.component';

import { ModalUtilityComponent } from '../utilities/modalUtility/ModalUtility.component';

@NgModule({
    imports: [BrowserModule, HttpClientModule, FormsModule],
    declarations: [LoginComponent, ModalUtilityComponent],
    bootstrap: [LoginComponent]
})
export class LoginModule { }