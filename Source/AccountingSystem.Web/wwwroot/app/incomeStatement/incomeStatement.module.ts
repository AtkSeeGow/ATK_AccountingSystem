import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { MyDatePickerModule } from 'mydatepicker';

import { IncomeStatementComponent } from './incomeStatement.component';

import { AutocompleteUtilityComponent } from '../utilities/autocompleteUtility/autocompleteUtility.component';
import { ModalUtilityComponent } from '../utilities/modalUtility/ModalUtility.component';

@NgModule({
    imports: [BrowserModule, HttpClientModule, FormsModule, MyDatePickerModule],
    declarations: [IncomeStatementComponent, AutocompleteUtilityComponent, ModalUtilityComponent],
    bootstrap: [IncomeStatementComponent]
})
export class IncomeStatementModule { }