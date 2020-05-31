
export class Condition {
    tradingDayBegin: any;
    tradingDayEnd: any;
    name: string;
    accountingSubjectCode: string;
    summary: string;
    monthInterval = 1;

    clone(): Condition {
        const result = new Condition();

        result.name = this.name;
        result.accountingSubjectCode = this.accountingSubjectCode;
        result.summary = this.summary;
        result.monthInterval = this.monthInterval;

        if (this.tradingDayBegin)
            result.tradingDayBegin = new Date(`${this.tradingDayBegin.date.year}-${this.tradingDayBegin.date.month}-${this.tradingDayBegin.date.day}`);
        if (this.tradingDayEnd)
            result.tradingDayEnd = new Date(`${this.tradingDayEnd.date.year}-${this.tradingDayEnd.date.month}-${this.tradingDayEnd.date.day}`);
        return result;
    }
}