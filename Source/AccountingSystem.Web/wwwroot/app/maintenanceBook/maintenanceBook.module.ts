import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { HotTableModule } from '@handsontable/angular';

import { MyDatePickerModule } from 'mydatepicker';

import { MaintenanceBookComponent } from './maintenanceBook.component';

import { AutocompleteUtilityComponent } from '../utilities/autocompleteUtility/autocompleteUtility.component';
import { ModalUtilityComponent } from '../utilities/modalUtility/ModalUtility.component';

@NgModule({
    imports: [BrowserModule, HttpClientModule, FormsModule, MyDatePickerModule, HotTableModule.forRoot()],
    declarations: [MaintenanceBookComponent, AutocompleteUtilityComponent, ModalUtilityComponent],
    bootstrap: [MaintenanceBookComponent]
})
export class MaintenanceBookModule { }