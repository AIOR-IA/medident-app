import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListPatientsComponent } from './list-patients/list-patients.component';
import { LayoutComponent } from './layout/layout.component';
import { PatientRoutingModule } from './patient-routing.module';
import { MaterialModule } from '../material/material.module';



@NgModule({
  declarations: [
    ListPatientsComponent,
    LayoutComponent
  ],
  imports: [
    CommonModule,
    PatientRoutingModule,
    MaterialModule,

  ]
})
export class PatientModule { }
