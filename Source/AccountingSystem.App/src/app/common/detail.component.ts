import * as moment from 'moment';

import { Entry, EntryTypeUtility } from './entry.component';

export class Detail {
  id: string = '00000000-0000-0000-0000-000000000000';
  name: string = '';
  tradingDay: any = '';
  recorder: string = '';
  entrys: Entry[] = [];

  static Clone(detail: Detail): Detail {
    const result = new Detail();
    result.id = detail.id;
    result.name = detail.name;

    result.tradingDay = detail.tradingDay.singleDate.formatted;

    result.recorder = detail.recorder
    detail.entrys.forEach(function (entry: Entry) {
      if (entry.type)
        result.entrys.push(Entry.Clone(entry));
    });
    return result;
  }

  static Parse(detail: Detail): Detail {
    var tradingDay = moment(detail.tradingDay);
    detail.tradingDay = {
      isRange: false,
      singleDate: {
        date: {
          year: tradingDay.year(),
          month: tradingDay.month() + 1,
          day: tradingDay.date()
        },
        formatted: tradingDay.format("YYYY/MM/DD")
      }
    };
    detail.entrys.forEach(function (entry: Entry) {
      entry.type = EntryTypeUtility.ToString(entry.type);
    });
    return detail;
  }

  static Equals(x: Detail, y: Detail) {
    x.entrys = x.entrys.filter(function (item) { return item.type && item.type !== '' });
    y.entrys = y.entrys.filter(function (item) { return item.type && item.type !== '' });

    if (x.tradingDay.singleDate.formatted !== y.tradingDay.singleDate.formatted)
      return false;

    if (x.entrys.length !== y.entrys.length)
      return false;

    x.entrys.forEach(function (entryX: any) {
      entryX.isRepeat = false;
    })

    y.entrys.forEach(function (entryY: any) {
      entryY.isRepeat = false;
    })

    x.entrys.forEach(function (entryX: any) {
      y.entrys.forEach(function (entryY: any) {
        if (entryY.isRepeat === false &&
          entryX.type === entryY.type &&
          entryX.accountingSubjectCode === entryY.accountingSubjectCode &&
          entryX.amount === entryY.amount) {
          entryX.isRepeat = true;
          entryY.isRepeat = true;
        }
      })
    })

    const isRepeatX = x.entrys.filter(function (item: any) { return item.isRepeat }).length === x.entrys.length;
    const isRepeatY = y.entrys.filter(function (item: any) { return item.isRepeat }).length === y.entrys.length;

    return isRepeatX && isRepeatY;
  }
}
