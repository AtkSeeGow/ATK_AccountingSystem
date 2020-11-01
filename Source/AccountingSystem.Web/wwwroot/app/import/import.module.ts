import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { HotTableModule } from '@handsontable/angular';

import { MyDatePickerModule } from 'mydatepicker';

import { ImportComponent } from './import.component';

import { AutocompleteUtilityComponent } from '../utilities/autocompleteUtility/autocompleteUtility.component';

@NgModule({
    imports: [BrowserModule, HttpClientModule, FormsModule, MyDatePickerModule, HotTableModule.forRoot()],
    declarations: [ImportComponent, AutocompleteUtilityComponent],
    bootstrap: [ImportComponent]
})
export class ImportModule { }