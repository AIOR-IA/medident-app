import { AfterViewInit, ChangeDetectorRef, Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { CalendarService } from './services/calendar.service';


// import Swal from 'sweetalert2';

//full calendar imports
import { FullCalendarComponent } from '@fullcalendar/angular';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { CalendarOptions, DateSelectArg, EventClickArg, EventApi, DatesSetArg, CalendarApi } from '@fullcalendar/core';
import esLocale from '@fullcalendar/core/locales/es';
import { createEventId } from '../shared/utils/event.utils';


interface User {
  id: number;
  name: string;
  email: string;
  color: string;
  isActive: boolean;
}

@Component({
  selector: 'calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit, AfterViewInit{
  isMobile = false;
  selectedDate = '';
  selectedStartTime = '';
  selectedEndTime = '';
  public calendarService = inject(CalendarService);

  public users: User[] = [
    {
      id: 1,
      name: 'Juan',
      email: 'XXXXXXXXXXXXXX',
      color: '#9e46ae',
      isActive: true
    },
    {
      id: 2,
      name: 'Maria',
      email: 'XXXXXXXXXXXXXX',
      color: '#202020',
      isActive: true
    },
    {
      id: 3,
      name: 'Pedro',
      email: 'XXXXXXXXXXXXXX',
      color: '#f05000',
      isActive: false,
    },

  ]
  @ViewChild('calendar') calendarComponent!: FullCalendarComponent; // 👈 Referencia al calendario
  private calendarApi: any;

  ngAfterViewInit() {
    if (this.calendarComponent) {
      this.calendarApi = this.calendarComponent.getApi(); // ✅ Ahora sí obtenemos la instancia
    } else {
      console.error('No se pudo obtener la instancia de FullCalendar');
    }
  }

  calendarVisible = signal(true);
  calendarOptions = signal<CalendarOptions>({
    plugins: [
      interactionPlugin,
      dayGridPlugin,
      timeGridPlugin,
      listPlugin,
    ],
    locale: esLocale,
    slotDuration: '00:15:00',
    slotLabelInterval: '00:15:00',
    slotLabelFormat: [
      {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true, // 24 horas
      },
      {
        meridiem: 'short', // Agrega AM/PM manualmente
      }
    ],

    slotMinTime: '07:00:00',
    slotMaxTime: '21:00:00',
    allDaySlot: false, // 🔄 Oculta la fila de eventos de todo el día
    expandRows: true,  // 🔄 Ajusta las filas al espacio disponible
    // height: 'auto',    // 🔄 Ajusta la altura dinámica según el contenido
    // Muestra las etiquetas de tiempo cada 15 minutos
    // slotDuration: '00:15:00',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
    },
    initialView: 'dayGridMonth',
    // initialEvents: INITIAL_EVENTS, // alternatively, use the `events` setting to fetch from a feed
    weekends: true,
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    select: this.handleDateSelect.bind(this),
    eventClick: this.handleEventClick.bind(this),
    eventsSet: this.handleEvents.bind(this),
    datesSet: this.onDatesSet.bind(this),
    eventMouseEnter: this.handleEventMouseEnter.bind(this),
    eventMouseLeave: this.handleEventMouseLeave.bind(this),
    /* you can update a remote database when these fire:
    eventAdd:
    eventChange:
    eventRemove:
    */
    buttonText: {
      prev: 'Anterior',  // 🔄 Cambia la flecha por texto
      next: 'Siguiente', // 🔄 Cambia la flecha por texto

    }
  });
  currentEvents = signal<EventApi[]>([]);

  constructor(private changeDetector: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.loadEvents();
  }

  private loadEvents(): void {
    this.calendarService.getEvents().subscribe(events => {
      this.calendarOptions.update(options => ({
        ...options,
        events: events // Mutar la señal correctamente
      }));
    });
  }



  handleCalendarToggle() {
    this.calendarVisible.update((bool) => !bool);
  }

  handleWeekendsToggle() {
    this.calendarOptions.update((options) => ({
      ...options,
      weekends: !options.weekends,
    }));
  }

  handleDateSelect(selectInfo: DateSelectArg) {
    const title = prompt('Please enter a new title for your event');
    this.calendarApi = selectInfo.view.calendar;

    this.calendarApi.unselect(); // Limpiar selección previa

    if (title) {
      // Buscar el usuario por nombre
      const user = this.users.find(user => user.name.toLowerCase() === title.toLowerCase());

      // Asignar un color por defecto si no encuentra el usuario
      const eventColor = user ? user.color : '#3787878'; // Azul por defecto

      let start = selectInfo.startStr;
      let end = selectInfo.endStr;
      let allDay = selectInfo.allDay;
      if (allDay) {
        // Si se seleccionó en vista de mes, establecer un horario por defecto
        start = `${selectInfo.startStr}T08:00:00`; // 8 AM
        end = `${selectInfo.startStr}T18:00:00`; // 6 PM
        allDay = false; // Convertir en evento con horario específico
      }
      // Agregar evento al calendario con color personalizado
      this.calendarApi.addEvent({
        id: createEventId(),
        title,
        start,
        end,
        allDay,
        backgroundColor: eventColor, // 👈 Color de fondo del evento
        borderColor: eventColor // 👈 Opcional: Color del borde
      });

      // Mostrar alerta de éxito
      // Swal.fire({
      //   title: "Evento agregado!",
      //   text: `Evento de ${title} añadido correctamente.`,
      //   icon: "success"
      // });
    }
  }

  private onDatesSet(dateInfo: DatesSetArg): void {
    console.log('Fecha visible:', dateInfo.start, '->', dateInfo.end);
    // this.loadEvents(dateInfo.start, dateInfo.end); // Cargar eventos para el nuevo rango
  }

  handleEventClick(clickInfo: EventClickArg) {
    if (confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
      clickInfo.event.remove();
    }
  }

  handleEvents(events: EventApi[]) {
    this.currentEvents.set(events);
    this.changeDetector.detectChanges(); // workaround for pressionChangedAfterItHasBeenCheckedError
  }

  addEvent(title: string, start: string, end: string) {
    console.log("addEvent");
    const calendarApi = this.calendarComponent.getApi(); // Obtener la instancia de FullCalendar

    // Buscar usuario si existe
    const user = this.users.find(user => user.name.toLowerCase() === title.toLowerCase());

    // Asignar color por defecto si no se encuentra usuario
    const eventColor = user ? user.color : '#3788d8';

    // Agregar evento al calendario
    this.calendarApi.addEvent({
      id: createEventId(),
      title: user ? user.name : title, // Si el usuario existe, usa su nombre formateado
      start: start,
      end: end,
      backgroundColor: eventColor,
      borderColor: eventColor
    });

    // Mensaje de confirmación
    // Swal.fire({
    //   title: "Evento agregado!",
    //   text: `Evento de ${user ? user.name : title} añadido correctamente.`,
    //   icon: "success"
    // });
  }
  addEventFromForm() {
    if (this.selectedDate && this.selectedStartTime && this.selectedEndTime) {
      const startDateTime = `${this.selectedDate}T${this.selectedStartTime}:00`;
      const endDateTime = `${this.selectedDate}T${this.selectedEndTime}:00`;
      this.addEvent('Nueva Cita', startDateTime, endDateTime);
    }
  }

  deleteEvents() {
    this.calendarApi.removeAllEvents();
    this.calendarApi.removeAllEventSources();
  }

  handleEventMouseEnter(info: any) {
    this.removeExistingTooltip(); // Asegurar que no haya tooltips previos

    const tooltip = document.createElement('div');
    tooltip.className = 'custom-tooltip';
    tooltip.innerText = info.event.title;
    tooltip.style.position = 'absolute';
    tooltip.style.background = 'rgba(0, 0, 0, 0.9)';
    tooltip.style.color = 'white';
    tooltip.style.padding = '5px 10px';
    tooltip.style.borderRadius = '5px';
    tooltip.style.whiteSpace = 'nowrap';
    tooltip.style.fontSize = '12px';
    tooltip.style.zIndex = '1000';
    tooltip.style.pointerEvents = 'none';

    // Posicionar el tooltip al lado del cursor
    document.body.appendChild(tooltip);
    tooltip.style.left = `${info.jsEvent.pageX + 10}px`;
    tooltip.style.top = `${info.jsEvent.pageY + 10}px`;

    // Guardar referencia en el elemento del evento
    info.el.dataset.tooltipId = tooltip.id = 'tooltip-' + info.event.id;
  }

  handleEventMouseLeave(info: any) {
    this.removeExistingTooltip();
  }

  // Función para eliminar tooltips previos
  removeExistingTooltip() {
    const existingTooltip = document.querySelector('.custom-tooltip');
    if (existingTooltip) {
      existingTooltip.remove();
    }
  }
}
