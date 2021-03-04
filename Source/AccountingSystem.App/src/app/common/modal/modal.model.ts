declare const $: any;

export class ModalModel {
    elementId: string = "";
    $element: any;
    title: string = "";
    messages: string[] = [];

    buttons: Button[] = [];

    constructor() {
        var component = this;
      this.buttons.push(new Button("Close", "btn btn-default", function () { component.hide(); }));
    };

    show() {
        $('#' + this.elementId).modal('show');
    }

    hide() {
        $('#' + this.elementId).modal('hide');
    }
}

export class Button {
    constructor(buttonName: string, className: string, onClicked: any) {
        this.buttonName = buttonName;
        this.className = className;
        this.onClicked = onClicked;
    };

    buttonName: string = "";
    className: string = "";

    onClicked() { };
}
