import { AfterViewInit, Component, Inject, inject } from '@angular/core';
import { TreatmentProductResponse } from 'src/app/calendar/interfaces/treatment-response.interface';
import { Treatment } from '../interfaces/treatment.interface';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Patient } from '../interfaces/patient.interface';
import { PatientService } from '../services/patient.service';
import { CalendarService } from 'src/app/calendar/services/calendar.service';
import { Event } from 'src/app/calendar/interfaces/event.interface';
import { PayTreatmentComponent } from '../pay-treatment/pay-treatment.component';

@Component({
  selector: 'app-list-treatments',
  templateUrl: './list-treatments.component.html',
  styleUrls: ['./list-treatments.component.scss']
})
export class ListTreatmentsComponent implements AfterViewInit {
  public selectedTreatmentProduct: TreatmentProductResponse[] = [];
  public selectedTreatment: Treatment;
  selectedRow: any = null;
  private patientService = inject(PatientService);

  public dialogRef = inject(MatDialogRef<ListTreatmentsComponent>);

  //products
  tableColumns: string[] = ['treatmentCreatedAt', 'treatmentBudget', 'treatmentOnAccount', 'treatmentDebt', 'productActions'];
  public treatments = new MatTableDataSource<Treatment>();

  // table selected products
  displayedColumns: string[] = ['position', 'name', 'price', 'quantity', 'total'];
  dataSource: MatTableDataSource<TreatmentProductResponse> = new MatTableDataSource<TreatmentProductResponse>();
  listEvents: Event[] = [];
  private snakBar = inject(MatSnackBar);
  private calendarService = inject(CalendarService);
  constructor(
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public patient: Patient
  ) {
  }

  ngAfterViewInit(): void {
    this.getAllTreatments(this.patient.idDoc);
  }

  async showServices(treatment: Treatment) {
    this.listEvents = [];
    this.selectedTreatment = null;
    this.dataSource.data = treatment.products;
    this.selectedTreatment = treatment;
    const events = await this.calendarService.getEventsByRecordId(treatment.idDoc);
    this.listEvents = events;
  }

  payTreatment(treatment: Treatment) {
    const detail = `Paciente: ${this.patient.firstName} ${this.patient.lastName}, CI: ${this.patient.ci}`;
    const dialogEditRef = this.dialog.open(PayTreatmentComponent, {
      data: { treatment, idPatient: this.patient.idDoc, detail: detail }
    });

    dialogEditRef.afterClosed().subscribe(result => {
      result && this.getAllTreatments(this.patient.idDoc);
    });
  }

  addRow(product: any) {
    this.selectedRow = product; // Guarda el producto seleccionado
  }



  isValidTreatment(treatmentProduct: TreatmentProductResponse): boolean {
    return this.selectedTreatmentProduct.some((product) => product.idDoc === treatmentProduct.idDoc);
  }

  deleteServicio(treatmentProduct: TreatmentProductResponse) {
    this.selectedTreatmentProduct = this.selectedTreatmentProduct.filter((product) => product.idDoc !== treatmentProduct.idDoc);
    this.openSnakBar('Tratamiento a realizar eliminado', 'Aceptar');
  }

  getAllTreatments(idPatient:string) {
    this.patientService.getAllTreatments(idPatient)
      .then((treatments: Treatment[]) => {
        this.treatments.data = treatments;
      }
      ).catch((error) => {
        this.openSnakBar('Error al obtener los tratamientos', 'Aceptar');
      }
      );
  }

  formatDate(data: Date): string {
    const startEvent = data.toLocaleTimeString('es-BO', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true // Activa el formato AM/PM
    });

    const date = data.toLocaleDateString('es-BO', { day: 'numeric', month: 'long' });
    const year = data.getFullYear();

    return `${date} ${year} ${startEvent}`;
  }

  formatTitle(title: string, dateSession: Date): string {
    const sms = title.split(',');
    const sentenceDoctor = sms[0];
    const infoDoctor = sentenceDoctor.slice(6).trim();
    const sentenceDoctorPatient = sms[1];
    const infoPatient = sentenceDoctorPatient.slice(10).trim();
    const products = sms[2];
    return `<b>FECHA SESION:</b> ${this.formatDate(dateSession)}<br><b>DOCTOR:</b> ${infoDoctor}<br><b>PACIENTE:</b> ${infoPatient} <br> <b>SERVICIOS:</b> <ul>${this.formatTreatments(products).map((product) => `<li>${product}</li>`).join('')}</ul> <hr>`;
  }

  formatTreatments(text: string): string[] {
    // Eliminar "TRATAMIENTOS: " del inicio
    const cleanText = text.replace("TRATAMIENTOS:", " ").trim();

    // Separar los tratamientos por " - "
    return cleanText.split(" - ");
  }
  /**
 * Method for showing a custom message.
 * @param message The message to display in the snack bar.
 * @param action The label for the action button in the snack bar.
 */
  openSnakBar(message: string, action: string): void {
    this.snakBar.open(message, action, { duration: 3000 });
  }


}
