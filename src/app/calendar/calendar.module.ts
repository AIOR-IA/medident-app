import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarRoutingModule } from './calendar-routing.module';
import { FullCalendarComponent, FullCalendarModule } from '@fullcalendar/angular';
import { FormsModule } from '@angular/forms';
import { CreateEventComponent } from './create-event/create-event.component';
import { CalendarComponent } from './layout/calendar.component';


@NgModule({
  declarations: [
    CalendarComponent,
    CreateEventComponent
  ],
  imports: [
    CommonModule,
    CalendarRoutingModule,
    FullCalendarModule,
    FormsModule,
  ]
})
export class CalendarModule { }
