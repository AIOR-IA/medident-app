import { Component, Inject, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { shortenBlankSpaces, ValidationAge, ValidationAmount, validationPatternNames, ValidationPhone } from 'src/app/shared/utils/validation.utils';
import { PatientService } from '../services/patient.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Patient } from '../interfaces/patient.interface';

@Component({
  selector: 'app-edit-patient',
  templateUrl: './edit-patient.component.html',
  styleUrls: ['./edit-patient.component.scss']
})
export class EditPatientComponent {
  public patientForm: FormGroup;


  public hasAccount: boolean = false;
  public changePasswordFields: boolean = false;

  private fb = inject(FormBuilder);;
  private patientService = inject(PatientService);
  private snakBar = inject(MatSnackBar);
  public dialogRef = inject(MatDialogRef<EditPatientComponent>);

  constructor(
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public patient: Patient
  ) { }

  ngOnInit(): void {
    this.patientForm = this.fb.group({
      firstName: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50),
        Validators.pattern(validationPatternNames)
      ]],
      lastName: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50),
        Validators.pattern(validationPatternNames)
      ]],
      ci: ['', [
        Validators.required,
        Validators.maxLength(15),
      ]],
      age: [0, [
        Validators.required,
        Validators.pattern(ValidationAge)
      ]],
      amount: [0, [
        Validators.required,
        Validators.pattern(ValidationAmount),
      ]],
      phoneNumber: ['', [
        Validators.required,
        Validators.pattern(ValidationPhone)
      ]],
    },
    );

    this.setCurrentPatientValues();
  }

  public setCurrentPatientValues(): void {
    this.patientForm.patchValue({
      firstName: this.patient.firstName,
      lastName: this.patient.lastName,
      phoneNumber: this.patient.phoneNumber,
      ci: this.patient.ci,
      age: this.patient.age,
      amount: this.patient.amount,
    });
  }

  /**
   * This method is to create a new User.
   */
  public updatePatient() {
    if (this.patientForm.valid) {
      this.trimValues();
      this.shortenBlankSpaces();
      const firstName = this.patientForm.get('firstName')!.value as string;
      const lastName = this.patientForm.get('lastName')!.value as string;
      const phoneNumber = this.patientForm.get('phoneNumber')!.value as string;
      const ci = this.patientForm.get('ci')!.value as string;
      const amount = this.patientForm.get('amount')!.value as number;
      const age = this.patientForm.get('age')!.value as number;
      const idDoc = this.patient.idDoc;

      this.patientService.updatePatient({ firstName, lastName, phoneNumber, ci, amount, age, idDoc })
        .then((data) => {
          this.reset();
          this.openSnakBar('Paciente actualizado', 'Aceptar');
          this.dialogRef.close(data);
        })
        .catch((error) => {
          this.openSnakBar('Error, no se pudo actualizar el paciente', 'Aceptar');
        });
    }
    else {
      this.patientForm.markAllAsTouched();
      return;
    }
  }

  /**
   * Method for showing a custom message.
   * @param message The message to display in the snack bar.
   * @param action The label for the action button in the snack bar.
   */
  openSnakBar(message: string, action: string): void {
    this.snakBar.open(message, action, { duration: 3000 });
  }

  /**
   * Trims whitespace from the beginning and end of form inputs.
   */
  private trimValues(): void {
    this.patientForm.patchValue({
      firstName: this.patientForm.get('firstName')!.value.trim(),
      lastName: this.patientForm.get('lastName')!.value.trim(),
      telefono: this.patientForm.get('phoneNumber')!.value.trim(),
      ci: this.patientForm.get('ci')!.value.trim(),
    })
  }

  /**
   * Replaces consecutive blank spaces with a single space.
   */
  private shortenBlankSpaces(): void {
    this.patientForm.patchValue({
      firstName: shortenBlankSpaces(this.patientForm.get('firstName')!.value),
      lastName: shortenBlankSpaces(this.patientForm.get('lastName')!.value),
      telefono: shortenBlankSpaces(this.patientForm.get('phoneNumber')!.value),
      ci: shortenBlankSpaces(this.patientForm.get('ci')!.value),
    })
  }



  /**
   * Method for get the firstName.
   */
  public get firstName() {
    return this.patientForm.get('firstName');
  }

  /**
   * Method for get the lastName.
   */
  public get lastname() {
    return this.patientForm.get('lastName');
  }

  /**
   * Method for get the phoneNumber.
   */
  public get phoneNumber() {
    return this.patientForm.get('phoneNumber');
  }

  /**
   * Method for get the amount.
   */
  public get amount() {
    return this.patientForm.get('amount');
  }

  /**
 * Method for get the ci.
 */
  public get ci() {
    return this.patientForm.get('ci');
  }

  /**
* Method for get the ci.
*/
  public get age() {
    return this.patientForm.get('age');
  }

  reset() {
    this.patientForm.reset();
  }
}
