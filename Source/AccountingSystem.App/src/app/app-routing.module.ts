import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthorizationFilter } from './common/authorizationFilter.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthorizationFilter],
    pathMatch: 'full',
    loadChildren: () => import('./generalJournal/generalJournal.module').then(m => m.GeneralJournalModule)
  },
  {
    path: 'Login',
    pathMatch: 'full',
    loadChildren: () => import('./login/login.module').then(m => m.LoginModule)
  },
  {
    path: 'GeneralJournal',
    canActivate: [AuthorizationFilter],
    pathMatch: 'full',
    loadChildren: () => import('./generalJournal/generalJournal.module').then(m => m.GeneralJournalModule)
  },
  {
    path: 'Import',
    canActivate: [AuthorizationFilter],
    pathMatch: 'full',
    loadChildren: () => import('./import/import.module').then(m => m.ImportModule)
  },
  {
    path: 'GeneralLedger',
    canActivate: [AuthorizationFilter],
    pathMatch: 'full',
    loadChildren: () => import('./generalLedger/generalLedger.module').then(m => m.GeneralLedgerModule)
  },
  {
    path: 'BalanceSheet',
    canActivate: [AuthorizationFilter],
    pathMatch: 'full',
    loadChildren: () => import('./balanceSheet/balanceSheet.module').then(m => m.BalanceSheetModule)
  },
  {
    path: 'IncomeStatement',
    canActivate: [AuthorizationFilter],
    pathMatch: 'full',
    loadChildren: () => import('./incomeStatement/incomeStatement.module').then(m => m.IncomeStatementModule)
  },
  {
    path: 'MaintenanceAccountingSubject',
    canActivate: [AuthorizationFilter],
    pathMatch: 'full',
    loadChildren: () => import('./maintenanceAccountingSubject/maintenanceAccountingSubject.module').then(m => m.MaintenanceAccountingSubjectModule)
  },
  {
    path: 'MaintenanceBook',
    canActivate: [AuthorizationFilter],
    pathMatch: 'full',
    loadChildren: () => import('./maintenanceBook/maintenanceBook.module').then(m => m.MaintenanceBookModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
