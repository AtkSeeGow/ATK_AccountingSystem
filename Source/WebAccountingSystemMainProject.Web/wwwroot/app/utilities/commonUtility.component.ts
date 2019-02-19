import { IMyDpOptions, IMyDateModel } from 'mydatepicker';

import { ModalUtilityModel } from './modalUtility/modalUtility.model';

declare const $: any;

export class HttpErrorResponseUtility {
    static Handler(httpErrorResponse: any, modalUtilityModel: ModalUtilityModel) {
        $.unblockUI();
        var response = httpErrorResponse;

        modalUtilityModel.messages = [];
        if (httpErrorResponse.status == 400 && httpErrorResponse.error.errorMessages) {
            for (var key in httpErrorResponse.error.errorMessages)
                modalUtilityModel.messages.push(httpErrorResponse.error.errorMessages[key]);
        }
        else if (httpErrorResponse.status == 500 && httpErrorResponse.error.message) {
            modalUtilityModel.messages.push(httpErrorResponse.error.message);
        }
        else {
            modalUtilityModel.messages.push("系統發生錯誤，請與系統管理員聯絡。");
        }
        
        modalUtilityModel.show();
    }
}

export class DatePickerUtility {
    static DatePickerOptions: IMyDpOptions = {
        dateFormat: 'yyyy/mm/dd',
        minYear: 1753,
    }

    static OnDateFieldChanged(event: any, condition: any, fieldName: string) {
    }
}

export class StringUtility {
    static SeparationSymbolMerge(originValue: string, mergeValue: string): string {
        var result = "";

        if (originValue == null)
            return result;

        var openParenthesisLastIndexOf = originValue.lastIndexOf(',');
        if (openParenthesisLastIndexOf != -1)
            result = originValue.substring(0, openParenthesisLastIndexOf) + ', ' + mergeValue;
        else
            result = mergeValue;
        
        return result;
    }

    static SelectLastValue(value: string): string {
        var result = "";

        if (value == null)
            return result;

        var openParenthesisLastIndexOf = value.lastIndexOf(',');
        if (openParenthesisLastIndexOf != -1)
            result = value.substring(openParenthesisLastIndexOf + 1, value.length);
        else
            result = value;

        return result.trim();
    }
}