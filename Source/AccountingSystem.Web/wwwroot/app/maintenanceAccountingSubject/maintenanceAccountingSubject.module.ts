import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { HotTableModule } from '@handsontable/angular';

import { MaintenanceAccountingSubjectComponent } from './maintenanceAccountingSubject.component';

import { ModalUtilityComponent } from '../utilities/modalUtility/ModalUtility.component';

@NgModule({
    imports: [BrowserModule, HttpClientModule, FormsModule, HotTableModule.forRoot()],
    declarations: [MaintenanceAccountingSubjectComponent, ModalUtilityComponent],
    bootstrap: [MaintenanceAccountingSubjectComponent]
})
export class MaintenanceAccountingSubjectModule { }