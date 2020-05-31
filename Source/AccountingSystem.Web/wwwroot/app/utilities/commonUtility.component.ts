import { IMyDpOptions } from 'mydatepicker';

declare const $: any;

export class HttpErrorResponseUtility {
    static Notify(httpErrorResponse: any) {
        var response = httpErrorResponse;

        if (httpErrorResponse.status == 400 && httpErrorResponse.error.errorMessages) {
            for (let key in httpErrorResponse.error.errorMessages)
                $.notify({ icon: "tim-icons icon-bell-55", message: httpErrorResponse.error.errorMessages[key] }, { type: 'warning', delay: 0, placement: { from: 'top', align: 'right' } });
        }
        else if (httpErrorResponse.status == 500 && httpErrorResponse.error.message) {
            $.notify({ icon: "tim-icons icon-bell-55", message: httpErrorResponse.error.message }, { type: 'warning', delay: 0, placement: { from: 'top', align: 'right' } });
        }
        else {
            $.notify({ icon: "tim-icons icon-bell-55", message: "系統發生錯誤，請與系統管理員聯絡。" }, { type: 'warning', delay: 0, placement: { from: 'top', align: 'right' } });
        }
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
        let result = "";

        if (originValue === null)
            return result;

        const openParenthesisLastIndexOf = originValue.lastIndexOf(',');
        if (openParenthesisLastIndexOf != -1)
            result = originValue.substring(0, openParenthesisLastIndexOf) + ', ' + mergeValue;
        else
            result = mergeValue;
        
        return result;
    }

    static SelectLastValue(value: string): string {
        let result = "";

        if (value === null)
            return result;

        const openParenthesisLastIndexOf = value.lastIndexOf(',');
        if (openParenthesisLastIndexOf != -1)
            result = value.substring(openParenthesisLastIndexOf + 1, value.length);
        else
            result = value;

        return result.trim();
    }
}