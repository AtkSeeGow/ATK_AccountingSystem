import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { HotTableModule } from '@handsontable/angular';
import { LayoutModule } from 'src/app/layout/layout.module'

import { AngularMyDatePickerModule } from 'angular-mydatepicker';

import { MaintenanceAccountingSubjectComponent } from './maintenanceAccountingSubject.component';

import { ModalModule } from '../common/modal/modal.component';
import { AutocompleteModule } from '../common/autocomplete/autocomplete.component';

const routes = [
  { path: '', component: MaintenanceAccountingSubjectComponent }
];

@NgModule({
  bootstrap: [MaintenanceAccountingSubjectComponent],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    HttpClientModule,
    FormsModule,
    LayoutModule,
    AngularMyDatePickerModule,
    AutocompleteModule,
    ModalModule,
    HotTableModule.forRoot()],
  declarations: [MaintenanceAccountingSubjectComponent],

})
export class MaintenanceAccountingSubjectModule { }
