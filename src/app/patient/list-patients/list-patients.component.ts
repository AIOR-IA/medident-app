import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Patient } from '../interfaces/patient.interface';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { PatientService } from '../services/patient.service';
import { debounceTime, Subject, Subscription } from 'rxjs';
import { CreatePatientComponent } from '../create-patient/create-patient.component';
import { EditPatientComponent } from '../edit-patient/edit-patient.component';

@Component({
  selector: 'list-patients',
  templateUrl: './list-patients.component.html',
  styleUrls: ['./list-patients.component.scss']
})
export class ListPatientsComponent {

  private listObs$: Subscription = new Subscription();
  @ViewChild('txtInput') txtInput: ElementRef<HTMLInputElement>;
  public debouncer: Subject<string> = new Subject();

  tableColumns: string[] = ['patientFullName', 'patientAge', 'patientPhoneNumber', 'patientCi', 'patientAmount', 'patientStatus', 'patientActions'];
  public patients = new MatTableDataSource<Patient>();


  public pageSize: number = 0;
  public pageLength: number = 0;
  public pageIndex: number = 0;
  public size: any;

  isLoading = false;
  lastDocument: Patient | null = null;

  private snakBar = inject(MatSnackBar);
  public dialog = inject(MatDialog);
  private patientService = inject(PatientService);

  constructor(
  ) { }

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
    this.pageSize = 10;
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
   * Method to open the page create Patient
   */
  public goToCreatePatient() {
    const dialogCreateRef = this.dialog.open(CreatePatientComponent);
    dialogCreateRef.afterClosed().subscribe(result => {
      result && this.getPatients();
    });

  }

  /**
   * Method to change the page size of the patient paginator.
   * @param pageEvent The PageEvent containing the new page size and length of the paginator.
   */
  public changeSize(pageEvent: PageEvent) {
    // this.pageSize = pageEvent.pageSize;
    // this.users.paginator.length = pageEvent.length;
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



  /**
   * Method to open the page edit patient
   * @param patient Patient is the object that We must send to the page edit patient
   */
  public goToEditPatient(patient) {
    const dialogEditRef = this.dialog.open(EditPatientComponent, {
      data: patient
    });
    dialogEditRef.afterClosed().subscribe(result => {
      result && this.getPatients();
    });
  };

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
