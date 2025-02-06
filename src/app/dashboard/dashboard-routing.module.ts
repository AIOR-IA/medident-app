import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent, // Contiene el sidebar y el router-outlet
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
        loadChildren: () => import('../product/product.module').then(m => m.ProductModule),
      },
      {
        path: 'user',
        loadChildren: () => import('../user/user.module').then(m => m.UserModule),
      },
      { path: '', redirectTo: 'calendar', pathMatch: 'full' } // Redirección por defecto dentro del Dashboard
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
