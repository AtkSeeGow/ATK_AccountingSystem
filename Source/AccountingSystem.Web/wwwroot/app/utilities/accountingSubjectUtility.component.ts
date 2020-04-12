export enum AccountingSubjectType {
    /** 無 */
    None,
    /** 資產 */
    Assets,
    /** 負債 */
    Liabilities,
    /** 業主權益 */
    OwnerEquity,
    /** 收入 */
    Revenues,
    /** 費用 */
    Expenses
}

export class AccountingSubjectTypeUtility {
    static ToString(accountingSubjectType: AccountingSubjectType): string {
        var result = '';

        if (accountingSubjectType == AccountingSubjectType.Assets)
            result = 'Assets';
        else if (accountingSubjectType == AccountingSubjectType.Liabilities)
            result = 'Liabilities';
        else if (accountingSubjectType == AccountingSubjectType.OwnerEquity)
            result = 'OwnerEquity';
        else if (accountingSubjectType == AccountingSubjectType.Revenues)
            result = 'Revenues';
        else if (accountingSubjectType == AccountingSubjectType.Expenses)
            result = 'Expenses';

        return result;
    }

    static Parse(accountingSubjectType: string): AccountingSubjectType {
        if (accountingSubjectType == 'Assets')
            return AccountingSubjectType.Assets;
        else if (accountingSubjectType == 'Liabilities')
            return AccountingSubjectType.Liabilities;
        else if (accountingSubjectType == 'OwnerEquity')
            return AccountingSubjectType.OwnerEquity;
        else if (accountingSubjectType == 'Revenues')
            return AccountingSubjectType.Revenues;
        else if (accountingSubjectType == 'Expenses')
            return AccountingSubjectType.Expenses;
        return AccountingSubjectType.None;
    }
}

export class AccountingSubject {
    accountingSubjectType: any = "";
    accountingSubjectCode: string = "";
    accountingSubjectName: string = "";
    accountingSubjectDescription: string = "";

    isEdit: boolean = false;

    static Clone(accountingSubject: any): AccountingSubject {
        var result = new AccountingSubject();
        result.accountingSubjectType = accountingSubject.accountingSubjectType;
        result.accountingSubjectCode = accountingSubject.accountingSubjectCode;
        result.accountingSubjectName = accountingSubject.accountingSubjectName;
        result.accountingSubjectDescription = accountingSubject.accountingSubjectDescription;
        result.isEdit = accountingSubject.isEdit;
        return result;
    }
}