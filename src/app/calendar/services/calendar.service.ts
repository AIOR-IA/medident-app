import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  backgroundColor?: string;
}


@Injectable({
  providedIn: 'root'
})
export class CalendarService {

  constructor() { }

  getEvents(): Observable<CalendarEvent[]> {
    return of([
      { id: '1', title: 'Cita con Juan', start: '2025-02-02T10:30:00', end: '2025-02-02T12:00:00', backgroundColor: '#FF5733' },
      { id: '2', title: 'Cita con Ana', start: '2025-02-04T17:00:00', end: '2025-02-04T19:00:00', backgroundColor: '#33FF57' }
    ]);
  }

}
