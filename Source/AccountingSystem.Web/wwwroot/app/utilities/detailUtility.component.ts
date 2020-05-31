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
}