import { Component, Inject, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Treatment } from '../interfaces/treatment.interface';
import { shortenBlankSpaces, ValidationPayment } from 'src/app/shared/utils/validation.utils';
import { PatientService } from '../services/patient.service';
import generateBuyTreatmentPDF from 'src/app/core/lib/pdfBuyTreatment';
import { ReportPayPDF } from '../../core/lib/pdfBuyTreatment';

@Component({
  selector: 'app-pay-treatment',
  templateUrl: './pay-treatment.component.html',
  styleUrls: ['./pay-treatment.component.scss']
})
export class PayTreatmentComponent {
  public treatmentForm: FormGroup;


  private fb = inject(FormBuilder);;
  private patientService = inject(PatientService);
  private snakBar = inject(MatSnackBar);
  public dialogRef = inject(MatDialogRef<PayTreatmentComponent>);

  public isLoading: boolean = false;
  constructor(
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.treatmentForm = this.fb.group({

      budget: ['', [
        Validators.required,
      ]],
      debt: ['', [
        Validators.required,

      ]],
      onAccount: ['', [
        Validators.required,
      ]],
      createdAt: ['', [
        Validators.required,
      ]],
      pay: [0, [
        Validators.required,
        Validators.pattern(ValidationPayment),
      ]],

    },

    );

    this.setCurrentUserValues();
  }

  public setCurrentUserValues(): void {
    this.treatmentForm.patchValue({
      budget: this.data.treatment.budget,
      debt: this.data.treatment.debt,
      createdAt: this.formatDate(this.data.treatment.createdAt),
      onAccount: this.data.treatment.onAccount,
    });
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('es-ES', {
      day: 'numeric', month: 'long', year: 'numeric',
      hour: '2-digit', minute: '2-digit', hour12: false
    }).format(date);
  }

  /**
   * This method is to create a new User.
   */
  public payTreatment() {
    this.isLoading = true;
    if (this.treatmentForm.valid) {

      const budget = (this.treatmentForm.get('budget')!.value as string);
      const debt = (this.treatmentForm.get('debt')!.value as number);
      const createdAt = (this.treatmentForm.get('createdAt')!.value);
      const onAccount = this.treatmentForm.get('onAccount')!.value as number;
      const pay = this.treatmentForm.get('pay')!.value as number;
      const idPatient = this.data.idPatient;
      const idRecord = this.data.treatment.idDoc;

      if( pay > debt) {
        this.isLoading = false;
        this.openSnakBar('El pago no puede ser mayor al adeudo', 'Aceptar');
        return;
      } else {
        const currentDate: string = this.formatDate(new Date());
        const totalonAccount = Number(onAccount) + Number(pay);
        const totalDebt = Number(debt) - Number(pay);

        const reportPayPDF: ReportPayPDF = {
          budget: budget,
          debt: totalDebt,
          onAccount: totalonAccount,
        }

        this.patientService.updateTreatmentDebt(idPatient, idRecord, pay)
        .then(async() => {
          this.reset();
          await generateBuyTreatmentPDF(reportPayPDF, currentDate, this.data.detail);
          this.isLoading = false;
          this.openSnakBar('Pago realizado', 'Aceptar');
          this.dialogRef.close(idPatient);
        })
        .catch((error) => {
          this.isLoading = false;
          this.openSnakBar('Error al realizar el pago', 'Aceptar');
        });
      }
    }
    else {
      this.isLoading = false;
      this.treatmentForm.markAllAsTouched();
      return;
    }
  }

  /**
   * Method for showing a custom message.
   * @param message The message to display in the snack bar.
   * @param action The label for the action button in the snack bar.
   */
  openSnakBar(message: string, action: string): void {
    this.snakBar.open(message, action, { duration: 3500 });
  }

  /**
   * Method for get the firstName.
   */
  public get budget() {
    return this.treatmentForm.get('budget');
  }

  /**
   * Method for get the lastName.
   */
  public get debt() {
    return this.treatmentForm.get('debt');
  }

  /**
   * Method for get the username.
   */
  public get createdAt() {
    return this.treatmentForm.get('createdAt');
  }

  /**
   * Method for get the email.
   */
  public get pay() {
    return this.treatmentForm.get('pay');
  }

  reset() {
    this.treatmentForm.reset();
  }
}
