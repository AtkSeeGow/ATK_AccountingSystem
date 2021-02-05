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
        let result = '';
        
        if (entryType === EntryType.Debits)
            result = 'Debits';
        else if (entryType === EntryType.Credits)
            result = 'Credits';

        return result;
    }

    static Parse(entryType: string): EntryType {
        if (entryType === 'Debits')
            return EntryType.Debits;
        else if (entryType === 'Credits')
            return EntryType.Credits;
        return EntryType.None;
    }
}

export class Entry {
    type: any = "";
    accountingSubjectCode: string = "";
    amount: number = 0;
    summary: string = "";

    static Clone(entry: Entry): Entry {
        const result = new Entry();
        result.type = EntryTypeUtility.Parse(entry.type);
        result.amount = entry.amount;
        result.summary = entry.summary;

        result.accountingSubjectCode = entry.accountingSubjectCode;
        var openParenthesisLastIndexOf = result.accountingSubjectCode.indexOf('(');
        if (openParenthesisLastIndexOf !== -1)
            result.accountingSubjectCode = entry.accountingSubjectCode.substring(0, openParenthesisLastIndexOf);
        
        return result;
    }
}