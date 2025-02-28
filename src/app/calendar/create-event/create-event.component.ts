import { Component, ElementRef, inject, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Patient } from 'src/app/patient/interfaces/patient.interface';
import { Product } from 'src/app/product/interfaces/product.interface';
import { ProductResponse } from '../interfaces/product-response.interface';
import { User } from 'src/app/user/interfaces/user.interface';
import { PatientService } from 'src/app/patient/services/patient.service';
import { MatTableDataSource } from '@angular/material/table';
import { Treatment } from 'src/app/patient/interfaces/treatment.interface';
import { TreatmentProductResponse } from '../interfaces/treatment-response.interface';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CalendarService } from '../services/calendar.service';
import { Event } from '../interfaces/event.interface';


@Component({
  selector: 'app-create-event',
  templateUrl: './create-event.component.html',
  styleUrls: ['./create-event.component.scss']
})
export class CreateEventComponent {

  public selectedPatient: Patient;
  public selectedUser: User;
  public selectedTreatmentProduct: TreatmentProductResponse[] = [];
  public selectedTreatment: Treatment;
  private patientService = inject(PatientService);

  public dialogRef = inject(MatDialogRef<CreateEventComponent>);

  //products
  tableColumns: string[] = ['treatmentCreatedAt', 'treatmentBudget', 'productActions'];
  public treatments = new MatTableDataSource<Treatment>();

  // table selected products
  displayedColumns: string[] = ['position', 'name', 'price', 'quantity', 'total', 'toDo', 'actions'];
  dataSource: MatTableDataSource<TreatmentProductResponse> = new MatTableDataSource<TreatmentProductResponse>();

  private snakBar = inject(MatSnackBar);
  private calendarService = inject(CalendarService);
  constructor(
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public time: any
  ) {
  }

  onPatientAdded(event: Patient) {
    this.selectedPatient = event;
    this.patientService.getAllTreatments(this.selectedPatient.idDoc)
      .then((treatments: Treatment[]) => {
        this.treatments.data = treatments;
      }
      ).catch((error) => {
        console.log({ error });
      }
      );
  }

  showServices(treatment: Treatment) {
    this.dataSource.data = treatment.products;
    this.selectedTreatment = treatment;

  }

  onUserAdded(event: User) {
    this.selectedUser = event;
  }

  addTreatmentToDo(treatmentProduct: TreatmentProductResponse) {
    if(treatmentProduct.toDo > 0) {
      if (treatmentProduct.done === treatmentProduct.quantity) {
        this.openSnakBar('Error, el tratamiento a este servicio ya está completado', 'Aceptar');
        return;
      }
      if (treatmentProduct.toDo > (treatmentProduct.quantity - treatmentProduct.done)) {
        this.openSnakBar(`Error, la cantidad de servicio a realizar no debe ser mayor a la cantidad `, 'Aceptar');
        return;
      } else {
        if (!this.isValidTreatment(treatmentProduct)) {
          this.selectedTreatmentProduct.push({ ...treatmentProduct });
          this.openSnakBar('Tratamiento a realizar agregado', 'Aceptar');
        } else {
          this.openSnakBar('Error, el tratamiento a este servicio ya está agregado', 'Aceptar');
        }
      }
    } else {
      this.openSnakBar('Error, la cantidad de servicio a realizar debe ser mayor a 0', 'Aceptar');
    }

  }

  isValidTreatment(treatmentProduct: TreatmentProductResponse): boolean {
    return this.selectedTreatmentProduct.some((product) => product.idDoc === treatmentProduct.idDoc);
  }

  deleteServicio(treatmentProduct: TreatmentProductResponse) {
    this.selectedTreatmentProduct = this.selectedTreatmentProduct.filter((product) => product.idDoc !== treatmentProduct.idDoc);
    this.openSnakBar('Tratamiento a realizar eliminado', 'Aceptar');
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('es-ES', {
      day: 'numeric', month: 'long', year: 'numeric',
      hour: '2-digit', minute: '2-digit', hour12: false
    }).format(date);
  }

  /**
 * Method for showing a custom message.
 * @param message The message to display in the snack bar.
 * @param action The label for the action button in the snack bar.
 */
  openSnakBar(message: string, action: string): void {
    this.snakBar.open(message, action, { duration: 3000 });
  }

  createEvent() {
    if (this.selectedUser === undefined) {
      this.openSnakBar('Error, debe seleccionar un doctor', 'Aceptar');
      return;
    }
    if (this.selectedPatient === undefined) {
      this.openSnakBar('Error, debe seleccionar un paciente', 'Aceptar');
      return;
    }
    if (this.selectedTreatmentProduct.length === 0) {
      this.openSnakBar('Error, debe seleccionar al menos un tratamiento', 'Aceptar');
      return;
    }

    const event: Event = {
      idDoc: '',
      title: `DOCTOR: ${this.selectedUser.firstName} ${this.selectedUser.lastName}, PACIENTE: ${this.selectedPatient.firstName} ${this.selectedPatient.lastName} con CI: ${this.selectedPatient.ci}, TRATAMIENTOS: ${this.selectedTreatmentProduct.map((product) =>  `${product.name.toUpperCase()} precio: ${product.price} realizar: ${product.toDo}`).join(' - ')} `,
      start: this.time.start,
      end: this.time.end,
      backgroundColor: this.selectedUser.color,
      idDocPatient: this.selectedPatient.idDoc,
      idDocRecords: this.selectedTreatment.idDoc,
      idDocUser: this.selectedUser.idDoc,
      products: this.selectedTreatmentProduct
    }
    this.calendarService.createEvent({ ...event })
      .then(() => {
        this.openSnakBar('Evento creado con éxito', 'Aceptar');
        this.dialogRef.close(true);
      }
      ).catch((error) => {
        console.log({ error });
        this.openSnakBar('Error, no se pudo crear el evento', 'Aceptar');
      }
    );
  }
}
