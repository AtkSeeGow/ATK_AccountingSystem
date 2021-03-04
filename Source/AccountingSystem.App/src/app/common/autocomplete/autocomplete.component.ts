import { Component, Input, ElementRef, NgModule } from '@angular/core';
import { AutocompleteModel } from './autocomplete.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

let counter = 0;

declare const $: any;

@Component({
  selector: 'autocompleteComponent',
  templateUrl: './autocomplete.html',
  inputs: ['autocompleteModel']
})
export class AutocompleteComponent {
  elementId: string = "";

  _autocompleteModel: AutocompleteModel = new AutocompleteModel();
  set autocompleteModel(autocompleteModel) {
    $(document).on('click', autocompleteModel.hideMenu.bind(autocompleteModel));

    const $element = $(this.elementRef.nativeElement);

    autocompleteModel.$element = $element;
    autocompleteModel.$element.on('click', 'li', autocompleteModel.onInternalSelected.bind(autocompleteModel));

    this._autocompleteModel = autocompleteModel;
  };
  get autocompleteModel() {
    return this._autocompleteModel;
  };

  constructor(private elementRef: ElementRef) {
    counter++;
    this.elementId = `${'autocomplete-'}${counter}`;
  }
}

@NgModule({
  imports: [
    CommonModule,
    FormsModule
  ],
  declarations: [AutocompleteComponent],
  exports: [AutocompleteComponent]
})
export class AutocompleteModule { };
