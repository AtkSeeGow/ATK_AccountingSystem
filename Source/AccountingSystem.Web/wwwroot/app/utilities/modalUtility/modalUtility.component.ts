import { Component, ElementRef } from '@angular/core';
import { ModalUtilityModel } from './modalUtility.model';

let counter = 0;

declare const $: any;
declare const globalConfig: any;

@Component({
    selector: 'modalUtilityComponent',
    templateUrl: './app/utilities/modalUtility/modalUtility.html',
    inputs: ['modalUtilityModel']
})
export class ModalUtilityComponent {
    elementId: string = "";

    _modalUtilityModel: ModalUtilityModel = new ModalUtilityModel();
    set modalUtilityModel(modalUtilityModel) {
        const $element = $(this.elementRef.nativeElement);

        modalUtilityModel.$element = $element;
        modalUtilityModel.elementId = this.elementId;

        this._modalUtilityModel = modalUtilityModel;
    };
    get modalUtilityModel() {
        return this._modalUtilityModel;
    };

    constructor(private elementRef: ElementRef) {
        var component = this;

        counter++;
        this.elementId = 'modalUtility-' + counter;
    };
}
