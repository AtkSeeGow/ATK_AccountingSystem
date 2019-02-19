import { Component } from '@angular/core';

import { LeftBarService } from './leftBar.service'

declare const $: any;
declare const globalConfig: any;

@Component({
    selector: 'leftBarComponent',
    templateUrl: './app/leftBar/leftBar.html',
    providers: [LeftBarService]
})
export class LeftBarComponent {
    globalConfig: any;

    constructor(private leftBarService: LeftBarService) {
        var component = this;
    };

    ngAfterViewInit() {
        $('#side-menu').metisMenu();
    }
}
