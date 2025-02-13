import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListPatientsComponent } from './list-patients/list-patients.component';
import { LayoutComponent } from './layout/layout.component';
import { PatientRoutingModule } from './patient-routing.module';
import { MaterialModule } from '../material/material.module';
import { CreatePatientComponent } from './create-patient/create-patient.component';
import { EditPatientComponent } from './edit-patient/edit-patient.component';
import { CoreModule } from '../core/core.module';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    ListPatientsComponent,
    LayoutComponent,
    CreatePatientComponent,
    EditPatientComponent
  ],
  imports: [
    CommonModule,
    PatientRoutingModule,
    RouterModule,
    MaterialModule,
    CoreModule,

  ]
})
export class PatientModule { }
