import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { HotTableModule } from '@handsontable/angular';
import { LayoutModule } from 'src/app/layout/layout.module'

import { AngularMyDatePickerModule } from 'angular-mydatepicker';

import { GeneralJournalComponent } from './generalJournal.component';

import { AutocompleteModule } from '../common/autocomplete/autocomplete.component';

const routes = [
  { path: '', component: GeneralJournalComponent }
];

@NgModule({
  bootstrap: [GeneralJournalComponent],
  imports: [
    RouterModule.forChild(routes),
    CommonModule ,
    HttpClientModule,
    AutocompleteModule,
    FormsModule,
    LayoutModule,
    AngularMyDatePickerModule, 
    HotTableModule.forRoot()],
  declarations: [GeneralJournalComponent],
  
})
export class GeneralJournalModule { }
