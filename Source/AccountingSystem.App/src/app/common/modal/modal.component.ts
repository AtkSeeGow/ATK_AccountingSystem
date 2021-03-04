import { Component, Input, ElementRef, NgModule } from '@angular/core';
import { ModalModel } from './modal.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

let counter = 0;

declare const $: any;
declare const globalConfig: any;

@Component({
    selector: 'modalComponent',
    templateUrl: './modal.html',
    inputs: ['modalModel']
})
export class ModalComponent {
    elementId: string = "";

    _modalModel: ModalModel = new ModalModel();
    set modalModel(modalModel) {
        const $element = $(this.elementRef.nativeElement);

        modalModel.$element = $element;
        modalModel.elementId = this.elementId;

        this._modalModel = modalModel;
    };
    get modalModel() {
        return this._modalModel;
    };

    constructor(private elementRef: ElementRef) {
        var component = this;

        counter++;
        this.elementId = 'modal-' + counter;
    };
}

@NgModule({
  imports: [
    CommonModule,
    FormsModule
  ],
  declarations: [ModalComponent],
  exports: [ModalComponent]
})
export class ModalModule { };
