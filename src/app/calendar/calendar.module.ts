import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarRoutingModule } from './calendar-routing.module';
import { FullCalendarComponent, FullCalendarModule } from '@fullcalendar/angular';
import { FormsModule } from '@angular/forms';
import { CreateEventComponent } from './create-event/create-event.component';
import { CalendarComponent } from './layout/calendar.component';
import { CoreModule } from '../core/core.module';
import { MaterialModule } from '../material/material.module';
import { ListCalendarPatientComponent } from './list-calendar-patient/list-calendar-patient.component';
import { ListCalendarProductComponent } from './list-calendar-product/list-calendar-product.component';
import { ListCalendarUserComponent } from './list-calendar-user/list-calendar-user.component';


@NgModule({
  declarations: [
    CalendarComponent,
    CreateEventComponent,
    ListCalendarPatientComponent,
    ListCalendarProductComponent,
    ListCalendarUserComponent,
  ],
  imports: [
    CommonModule,
    CalendarRoutingModule,
    FullCalendarModule,
    FormsModule,
    CoreModule,
    MaterialModule,
  ],
})
export class CalendarModule { }
