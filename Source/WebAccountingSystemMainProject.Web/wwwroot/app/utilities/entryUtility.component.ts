export enum EntryType {
    /** 無 */
    None,
    /** 借方 */
    Debits,
    /** 貸方 */
    Credits
}

export class EntryTypeUtility {
    static ToString(entryType: EntryType): string {
        var result = '';

        if (entryType == EntryType.Debits)
            result = 'Debits';
        else if (entryType == EntryType.Credits)
            result = 'Credits';

        return result;
    }

    static Parse(entryType: string): EntryType {
        if (entryType == 'Debits')
            return EntryType.Debits;
        else if (entryType == 'Credits')
            return EntryType.Credits;
        return EntryType.None;
    }
}

export class Entry {
    entryBookName: string = "";
    entryType: any = "";
    entryTradingDay: any = "";
    entryAccountingSubject: string = "";
    entryAmount: number = 0;
    entrySummary: string = "";
    entryRecorder: string = "";

    isEdit: boolean = false;

    static Clone(entry: any): Entry {
        var result = new Entry();
        result.entryBookName = entry.entryBookName;
        result.entryType = entry.entryType;
        result.entryTradingDay = entry.entryTradingDay;
        result.entryAccountingSubject = entry.entryAccountingSubject;
        result.entryAmount = entry.entryAmount;
        result.entrySummary = entry.entrySummary;
        result.entryRecorder = entry.entryRecorder;
        result.isEdit = entry.isEdit;
        return result;
    }
}

export class EntryForCondition extends Entry {
    entryTradingDayBegin: any = null;
    entryTradingDayEnd: any = null;
    entryIsByDate: boolean = false;

    clone(): EntryForCondition {
        var result = new EntryForCondition();

        result.entryBookName = this.entryBookName;
        result.entryAccountingSubject = this.entryAccountingSubject;
        result.entrySummary = this.entrySummary;

        if (this.entryTradingDayBegin)
            result.entryTradingDayBegin = new Date(this.entryTradingDayBegin.date.year, this.entryTradingDayBegin.date.month - 1, this.entryTradingDayBegin.date.day);
        
        if (this.entryTradingDayEnd)
            result.entryTradingDayEnd = new Date(this.entryTradingDayEnd.date.year, this.entryTradingDayEnd.date.month - 1, this.entryTradingDayEnd.date.day);

        result.entryIsByDate = this.entryIsByDate;

        return result;
    }
}