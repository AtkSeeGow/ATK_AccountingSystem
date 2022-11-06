
export class Condition {
  tradingDayBegin: any;
  tradingDayEnd: any;
  name: string = "";
  accountingSubjectCode: string = "";
  summary: string = "";
  monthInterval = 1;

  clone(): Condition {
    const result = new Condition();

    result.name = this.name;
    result.accountingSubjectCode = this.accountingSubjectCode;
    result.summary = this.summary;
    result.monthInterval = this.monthInterval;

    if (this.tradingDayBegin) {
      var tradingDayBegin = this.tradingDayBegin.singleDate.date;
      result.tradingDayBegin = new Date(`${tradingDayBegin.year}-${tradingDayBegin.month}-${tradingDayBegin.day} 00:00:00`);
    }

    if (this.tradingDayEnd) {
      var tradingDayEnd = this.tradingDayEnd.singleDate.date;
      result.tradingDayEnd = new Date(`${tradingDayEnd.year}-${tradingDayEnd.month}-${tradingDayEnd.day} 00:00:00`);
    }

    return result;
  }
}
