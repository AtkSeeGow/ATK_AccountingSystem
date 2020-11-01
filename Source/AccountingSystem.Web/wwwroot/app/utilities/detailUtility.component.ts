import { Entry } from './entryUtility.component';

export class Detail {
    id: string;
    name: string;
    tradingDay: any;
    recorder: string;
    entrys: Entry[] = [];

    static Clone(detail: Detail): Detail {
        const result = new Detail();
        result.id = detail.id;
        result.name = detail.name;
        result.tradingDay = detail.tradingDay;
        result.recorder = detail.recorder
        detail.entrys.forEach(function (entry: Entry) {
            if (entry.type)
                result.entrys.push(Entry.Clone(entry));
        });
        return result;
    }

    static Equals(x: Detail, y: Detail) {
        x.entrys = x.entrys.filter(function (item) { return item.type && item.type !== '' });
        y.entrys = y.entrys.filter(function (item) { return item.type && item.type !== '' });

        if (x.tradingDay !== y.tradingDay)
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