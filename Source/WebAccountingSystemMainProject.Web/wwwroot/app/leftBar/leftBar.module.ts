import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { LeftBarComponent } from './leftBar.component';

@NgModule({
    imports: [BrowserModule, HttpClientModule, FormsModule],
    declarations: [LeftBarComponent],
    bootstrap: [LeftBarComponent]
})
export class LeftBarModule { }