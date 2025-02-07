import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListPatientsComponent } from './list-patients/list-patients.component';
import { LayoutComponent } from './layout/layout.component';
import { PatientRoutingModule } from './patient-routing.module';



@NgModule({
  declarations: [
    ListPatientsComponent,
    LayoutComponent
  ],
  imports: [
    CommonModule,
    PatientRoutingModule,

  ]
})
export class PatientModule { }
