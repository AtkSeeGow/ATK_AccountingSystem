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

  static Color(accountingSubjectType: AccountingSubjectType): string {
    let result = '';

    if (accountingSubjectType === AccountingSubjectType.Assets)
      result = '#eb9d98';
    else if (accountingSubjectType === AccountingSubjectType.Liabilities)
      result = '#a0c4fd';
    else if (accountingSubjectType === AccountingSubjectType.OwnerEquity)
      result = '#fee071';
    else if (accountingSubjectType === AccountingSubjectType.Revenues)
      result = '#7eceaa';
    else if (accountingSubjectType === AccountingSubjectType.Expenses)
      result = '#cccccc';

    return result;
  }

  static IsLogicalDisplayType(accountingSubjectType: AccountingSubjectType): boolean {
    if (accountingSubjectType === AccountingSubjectType.Liabilities)
      return true;
    else if (accountingSubjectType === AccountingSubjectType.OwnerEquity)
      return true;
    else if (accountingSubjectType === AccountingSubjectType.Revenues)
      return true;
    return false;
  }
}

export class AccountingSubject {
  type: any = "";
  code: string = "";
  name: string = "";
  description: string = "";

  isEdit: boolean = false;

  static Clone(accountingSubject: any): AccountingSubject {
    var result = new AccountingSubject();
    result.type = accountingSubject.type;
    result.code = accountingSubject.code;
    result.name = accountingSubject.name;
    result.description = accountingSubject.description;
    result.isEdit = accountingSubject.isEdit;
    return result;
  }
}
