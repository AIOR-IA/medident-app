import { AfterViewInit, ChangeDetectorRef, Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { CalendarService } from '../services/calendar.service';
import { Timestamp } from '@angular/fire/firestore';
//full calendar imports
import { FullCalendarComponent } from '@fullcalendar/angular';
import interactionPlugin, { EventResizeDoneArg } from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { CalendarOptions, DateSelectArg, EventClickArg, EventApi, DatesSetArg, CalendarApi } from '@fullcalendar/core';
import esLocale from '@fullcalendar/core/locales/es';
import { createEventId } from '../../shared/utils/event.utils';
import { Event } from '../interfaces/event.interface';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ClassButtonType } from 'src/app/shared/enums/class.button.type.enum';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmCalendarDialogComponent } from 'src/app/core/confirm-calendar-dialog/confirm-calendar-dialog.component';
import { CreateEventComponent } from '../create-event/create-event.component';
import { ConfirmDialogComponent } from 'src/app/core/confirm-dialog/confirm-dialog.component';
import { AuthService } from '../../auth/services/auth.service';
import { User } from 'src/app/user/interfaces/user.interface';


interface UserCalendar {
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
export class CalendarComponent implements OnInit, AfterViewInit {
  isMobile = false;
  private snakBar = inject(MatSnackBar);
  public dialog = inject(MatDialog);

  currentStartDate = new Date();
  currentEndDate = new Date();
  public currentUser: User | null = null;
  private authService = inject(AuthService);

  selectedDate = '';
  selectedStartTime = '';
  selectedEndTime = '';
  public calendarService = inject(CalendarService);
  public events: Event[] = []
  public users: UserCalendar[] = [
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
  @ViewChild('calendar') calendarComponent!: FullCalendarComponent;
  private calendarApi: any;

  ngAfterViewInit() {
    if (this.calendarComponent) {
      this.calendarApi = this.calendarComponent.getApi();
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
    editable: false,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    select: this.handleDateSelect.bind(this), // ti new events
    eventClick: this.handleEventClick.bind(this),
    eventsSet: this.handleEvents.bind(this),
    datesSet: this.onDatesSet.bind(this),
    eventMouseEnter: this.handleEventMouseEnter.bind(this),
    eventMouseLeave: this.handleEventMouseLeave.bind(this),
    eventResize: this.onEventResize.bind(this),
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
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.currentUser = user;
      }
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


    const dateNow = selectInfo.start;
    if (new Date() > dateNow) {
      this.openSnakBar('Error no puede crear un evento previo a la hora y fecha actual', 'Aceptar');
      this.calendarApi.unselect();
    } else {
      const startEvent = selectInfo.start.toLocaleTimeString('es-BO', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true // Activa el formato AM/PM
      });

      const endEvent = selectInfo.end.toLocaleTimeString('es-BO', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });

      const date = selectInfo.start.toLocaleDateString('es-BO', { day: 'numeric', month: 'long' });
      const year = selectInfo.start.getFullYear();

      const message = `Hora: ${startEvent} &nbsp;${endEvent} <br>Fecha: ${date} ${year}`;
      const confirm = `Crear`;

      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        width: '450px',
        data: {
          title: 'Crear nuevo evento',
          description: message,
          btnCancel: { text: 'Cancelar', class: ClassButtonType.Black },
          btnConfirm: { text: confirm, class: ClassButtonType.Blue },
        },
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          const time = {
            start: selectInfo.start,
            end: selectInfo.end,
          }
          const dialogEditRef = this.dialog.open(CreateEventComponent, {
            data: time,
          });
          dialogEditRef.afterClosed().subscribe(result => {
            this.getAllEvents(this.currentStartDate, this.currentEndDate);

          });
        }
      });
    }

  }

  /**
   * use to load All events
   * @param dateInfo
   */
  private onDatesSet(dateInfo: DatesSetArg): void {
    this.currentEndDate = dateInfo.end;
    this.currentStartDate = dateInfo.start;
    this.getAllEvents(dateInfo.start, dateInfo.end);
    // this.loadEvents(dateInfo.start, dateInfo.end); // Cargar eventos para el nuevo rango
  }

  getAllEvents(start: Date, end: Date) {
    this.calendarService.getAllEvents(start, end)
      .then(listEvent => {
        const events = listEvent.map(event => ({
          id: event.idDoc,
          title: event.title,
          start: event.start.toDate(),
          end: event.end.toDate(),
          backgroundColor: event.backgroundColor
        }));

        this.calendarOptions.update(options => ({
          ...options,
          events: []
        }));

        this.calendarOptions.update(options => ({
          ...options,
          events: events
        }));
      })
      .catch(error => {
        console.error('Error al obtener eventos:', error);
      });
  }

  // delete events
  handleEventClick(info: EventClickArg) {
    if (this.currentUser.role === 'admin') {
      const time = {
        start: info.event.start,
        end: info.event.end,
        id: '23'
      }
      const confirm = 'Actualizar';
      const deleteEvent = 'Eliminar'


      const dialogRef = this.dialog.open(ConfirmCalendarDialogComponent, {
        width: '420px',
        data: {
          title: `¿ Desea eliminar la cita ?`,
          btnCancel: { text: 'Cancelar', class: ClassButtonType.Black },
          // btnConfirm: { text: confirm, class: ClassButtonType.Blue },
          btnEdit: { text: deleteEvent, class: ClassButtonType.Delete },
        },
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result === 'delete') {
          this.calendarService.getEventById(info.event.id).then(result => {
            this.calendarService.deleteTreatmentProducts(result.idDocPatient, result.idDocRecords, result.products, info.event.id)
              .then(() => {
                this.getAllEvents(this.currentStartDate, this.currentEndDate);
                this.openSnakBar('Evento eliminado', 'Aceptar');
              })
              .catch(error => {
                this.openSnakBar('Error al eliminar el evento', 'Aceptar');
              })
          })
            .catch(error => {
              this.openSnakBar('Error al obtener el evento', 'Aceptar');
            })
        }
        if (result === 'update') {
          const dialogEditRef = this.dialog.open(CreateEventComponent, {
            data: time,
          });
          dialogEditRef.afterClosed().subscribe(result => {
            // console.log(result);
          });
        }
      });
      this.calendarApi.unselect();


    }
  }

  // Método para capturar el resize del evento
  private onEventResize(info: EventResizeDoneArg) {


    // Aquí puedes actualizar la base de datos con el nuevo horario
  }

  handleEvents(events: EventApi[]) {
    this.currentEvents.set(events);
    this.changeDetector.detectChanges(); // workaround for pressionChangedAfterItHasBeenCheckedError
  }



  /**
    * Method for showing a custom message.
    * @param message The message to display in the snack bar.
    * @param action The label for the action button in the snack bar.
    */
  openSnakBar(message: string, action: string): void {
    this.snakBar.open(message, action, { duration: 3000 });
  }

  isValidDate(selectedDate: Date) {
    return new Date() > selectedDate;
  }


  //! ALL THIS IS TO CREATE AN EVENT FROM A FORM
  addEventFromForm() {
    if (this.selectedDate && this.selectedStartTime && this.selectedEndTime) {
      const startDateTime = `${this.selectedDate}T${this.selectedStartTime}:00`;
      const endDateTime = `${this.selectedDate}T${this.selectedEndTime}:00`;
      this.addEvent('Nueva Cita', startDateTime, endDateTime);
    }
  }

  addEvent(title: string, start: string, end: string) {
    const calendarApi = this.calendarComponent.getApi();

    // Buscar usuario si existe
    const user = this.users.find(user => user.name.toLowerCase() === title.toLowerCase());

    // Asignar color por defecto si no se encuentra usuario
    const eventColor = user ? user.color : '#3788d8';

    // Agregar evento al calendario
    this.calendarApi.addEvent({
      id: createEventId(),
      title: user ? user.name : title,
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
    tooltip.style.whiteSpace = 'normal'; // Permitir saltos de línea
    tooltip.style.wordWrap = 'break-word'; // Romper palabras largas si es necesario
    tooltip.style.fontSize = '14px';
    tooltip.style.zIndex = '1000';
    tooltip.style.pointerEvents = 'none';
    tooltip.style.maxWidth = '250px'; // Limitar el ancho máximo para evitar desbordamiento
    tooltip.style.boxShadow = '0px 0px 5px rgba(0, 0, 0, 0.5)';

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
