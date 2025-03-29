import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppLayoutComponent } from './layout/layout.component';
import { isAdminGuard } from '../guards/is-admin.guard';

const routes: Routes = [
  {
    path: '',
    component: AppLayoutComponent,
    children: [
      {
        path: 'calendar',
        loadChildren: () => import('../calendar/calendar.module').then(m => m.CalendarModule),
      },
      {
        path: 'patient',
        loadChildren: () => import('../patient/patient.module').then(m => m.PatientModule),
      },
      {
        path: 'product',
        canActivate: [isAdminGuard],
        loadChildren: () => import('../product/product.module').then(m => m.ProductModule),
      },
      {
        path: 'user',
        canActivate: [isAdminGuard],
        loadChildren: () => import('../user/user.module').then(m => m.UserModule),
      },
      { path: '', redirectTo: 'calendar', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
