import { Component, Input, ElementRef } from '@angular/core';

import { AutocompleteUtilityModel } from './autocompleteUtility.model';

let counter = 0;

declare const $: any;

@Component({
    selector: 'autocompleteUtilityComponent',
    templateUrl: './app/utilities/autocompleteUtility/autocompleteUtility.html',
    inputs: ['autocompleteUtilityModel']
})
export class AutocompleteUtilityComponent {
    elementId: string = "";

    _autocompleteUtilityModel: AutocompleteUtilityModel = new AutocompleteUtilityModel();
    set autocompleteUtilityModel(autocompleteUtilityModel) {
        $(document).on('click', autocompleteUtilityModel.hideMenu.bind(autocompleteUtilityModel));

        const $element = $(this.elementRef.nativeElement);

        autocompleteUtilityModel.$element = $element;
        autocompleteUtilityModel.$element.on('click', 'li a', autocompleteUtilityModel.onSelected.bind(autocompleteUtilityModel));

        this._autocompleteUtilityModel = autocompleteUtilityModel;
    };
    get autocompleteUtilityModel() {
        return this._autocompleteUtilityModel;
    };

    constructor(private elementRef: ElementRef) {
        counter++;
        this.elementId = `${'autocomplete-'}${counter}`;
    }
}