import { Component, ElementRef, EventEmitter, inject, Output, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { debounceTime, Subject, Subscription } from 'rxjs';
import { Patient } from 'src/app/patient/interfaces/patient.interface';
import { PatientService } from 'src/app/patient/services/patient.service';

@Component({
  selector: 'list-calendar-patient',
  templateUrl: './list-calendar-patient.component.html',
  styleUrls: ['./list-calendar-patient.component.scss']
})
export class ListCalendarPatientComponent {

  @Output() selectedPatient = new EventEmitter<Patient>();

  @ViewChild('txtInput') txtInput: ElementRef<HTMLInputElement>;
  public debouncer: Subject<string> = new Subject();
  private listObs$: Subscription = new Subscription();
  tableColumns: string[] = ['patientFullName', 'patientAge', 'patientPhoneNumber', 'patientCi', 'patientActions'];
  public patients = new MatTableDataSource<Patient>();


  public pageSize: number = 0;
  public pageLength: number = 0;
  public pageIndex: number = 0;
  public size: any;

  isLoading = false;
  lastDocument: Patient | null = null;

  private snakBar = inject(MatSnackBar);
  private patientService = inject(PatientService);



  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngOnInit(): void {
    this.getPatients();

    this.debouncer
      .pipe(
        debounceTime(800)
      )
      .subscribe(search => {
        this.getPatients(search);
      })
    this.pageSize = 5;
  }

  ngOnDestroy(): void {
    this.debouncer.unsubscribe();
    this.listObs$.unsubscribe();
  }

  ngAfterViewInit(): void {
    this.patients.paginator = this.paginator;
  }



  /**
   * Method to get all the patients
   */
  public getPatients(name = '') {
    this.listObs$.unsubscribe();
    this.listObs$ = new Subscription()

    this.size = this.pageSize;
    this.pageSize = 0;
    const patientsObs$ = this.patientService.getAllPatientsObs(name).subscribe(patients => {
      this.patients.data = patients;
      this.pageLength = patients.length;
    });
    this.pageSize = this.size;
    this.listObs$.add(patientsObs$);
  }




  /**
   * Method for showing a custom message.
   * @param message The message to display in the snack bar.
   * @param action The label for the action button in the snack bar.
  */
  openSnakBar(message: string, action: string): void {
    this.snakBar.open(message, action, { duration: 3000 });
    // this.getUsers();
  }

  /**
   * This method displays a message to the user based on the type of error.
   * @param error receive the kind of error
   */
  private handleError(error: Response | any) {
    if (error == 'El valor de clave duplicado viola la restricción de unicidad') {
      this.openSnakBar('Error: Usuario existente, verifique el usuario o email', 'Aceptar');
    } else {
      this.openSnakBar('No se pudo cambiar el estado al usuario, inténtelo más tarde', 'Aceptar');
    }
  }


  addPatient(patient: Patient) {
    this.selectedPatient.emit(patient)

  }


  filterBy(search: string) {
    const name = search.trim().toLowerCase();
    this.debouncer.next(name);
  }

  clearFilter() {
    if (this.txtInput.nativeElement.value.length > 0) {
      this.txtInput.nativeElement.value = '';
      this.getPatients();
    }
  }
}
