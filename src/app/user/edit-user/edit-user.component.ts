import { Component, Inject, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ColorsType, shortenBlankSpaces, TypeRole, validationPatternEmail, validationPatternNames, validationPatternPassword, ValidationPhone } from 'src/app/shared/utils/validation.utils';
import { UserService } from '../services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { passwordMatchValidator } from 'src/app/shared/custom-validation-password/custom-validation-password';
import { RoleType } from 'src/app/shared/enums/roleUser.type.enum';
import { User } from '../interfaces/user.interface';
import { ConfirmDialogComponent } from 'src/app/core/confirm-dialog/confirm-dialog.component';
import { ClassButtonType } from 'src/app/shared/enums/class.button.type.enum';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent {
  public userForm: FormGroup;
  public TypeRole = TypeRole;
  public ColorType = ColorsType;

  private fb = inject(FormBuilder);;
  private userService = inject(UserService);
  private snakBar = inject(MatSnackBar);
  public dialogRef = inject(MatDialogRef<EditUserComponent>);

  constructor(
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public user: User
  ) { }

  ngOnInit(): void {
    this.userForm = this.fb.group({
      role: ['', [Validators.required]],
      color: ['', [Validators.required]],
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
      email: ['', [
        Validators.required,
        Validators.pattern(validationPatternEmail)
      ]],
      ci: ['', [
        Validators.required,
      ]],
      phoneNumber: ['', [
        Validators.required,
        Validators.pattern(ValidationPhone)
      ]],

      address: ['', [
        Validators.required,
        Validators.maxLength(100),
      ]],

    },

  );

    this.setCurrentUserValues();
  }

  public setCurrentUserValues(): void {
    this.userForm.patchValue({
      firstName: this.user.firstName,
      lastName: this.user.lastName,
      phoneNumber: this.user.phoneNumber,
      email: this.user.email,
      ci: this.user.ci,
      address: this.user.address,
      role: this.user.role,
      color: this.user.color,
    });
  }

  /**
   * This method is to create a new User.
   */
  public updateUser() {
    if (this.userForm.valid) {
      this.trimValues();
      this.shortenBlankSpaces();

      const firstName = (this.userForm.get('firstName')!.value as string).toLowerCase();
      const lastName = (this.userForm.get('lastName')!.value as string).toLowerCase();
      const phoneNumber = (this.userForm.get('phoneNumber')!.value as string).toLowerCase();
      const email = this.userForm.get('email')!.value as string;
      const ci = this.userForm.get('ci')!.value as string;
      const address = (this.userForm.get('address')!.value as string).toLowerCase();
      const role = this.userForm.get('role')!.value as RoleType;
      const color = this.userForm.get('color')!.value as string;
      const idDoc = this.user.idDoc;
      this.userService.updateUser({ firstName, lastName, phoneNumber, email, ci, address, role, color, idDoc  })
        .then((data) => {
          this.reset();
          this.openSnakBar('Usuario actualizado', 'Aceptar');
          this.dialogRef.close(data);
        })
        .catch((error) => {
          this.openSnakBar('No se pudo editar al usuario, inténtelo más tarde', 'Aceptar');
        });
    }
    else {
      this.userForm.markAllAsTouched();
      return;
    }
  }

  goToUpdatePassword() {
    const message = `¿Deseas actualizar la contraseña del usuario: ${this.user.firstName} con correo: ${this.user.email} ?`;
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
          width: '430px',
          data: {
            title: 'Actualizar Contraseña ',
            description: message,
            btnCancel: { text: 'Cancelar', class: ClassButtonType.Black },
            btnConfirm: { text: 'Aceptar', class: ClassButtonType.Delete },
          },
        });

        dialogRef.afterClosed().subscribe((result) => {
          if (result) {
            this.userService.resetPassword(this.user.email)
              .then((data) => {
                this.openSnakBar('Se envio un link para actualizar su contraseña', 'Aceptar');
              })
              .catch(error => {
                (error) => this.openSnakBar('No se pudo actualizar la contraseña del usuario', 'Aceptar');
              })
          }
        });
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
   * Trims whitespace from the beginning and end of form inputs.
   */
  private trimValues(): void {
    this.userForm.patchValue({
      firstName: this.userForm.get('firstName')!.value.trim(),
      lastName: this.userForm.get('lastName')!.value.trim(),
      telefono: this.userForm.get('phoneNumber')!.value.trim(),
      email: this.userForm.get('email')!.value.trim(),
      ci: this.userForm.get('ci')!.value.trim(),
      address: this.userForm.get('address')!.value.trim(),
    })
  }

  /**
   * Replaces consecutive blank spaces with a single space.
   */
  private shortenBlankSpaces(): void {
    this.userForm.patchValue({
      firstName: shortenBlankSpaces(this.userForm.get('firstName')!.value),
      lastName: shortenBlankSpaces(this.userForm.get('lastName')!.value),
      telefono: shortenBlankSpaces(this.userForm.get('phoneNumber')!.value),
      email: shortenBlankSpaces(this.userForm.get('email')!.value),
      ci: shortenBlankSpaces(this.userForm.get('ci')!.value),
      address: shortenBlankSpaces(this.userForm.get('address')!.value),
    })
  }



  /**
   * Method for get the firstName.
   */
  public get firstName() {
    return this.userForm.get('firstName');
  }

  /**
   * Method for get the lastName.
   */
  public get lastname() {
    return this.userForm.get('lastName');
  }

  /**
   * Method for get the username.
   */
  public get phoneNumber() {
    return this.userForm.get('phoneNumber');
  }

  /**
   * Method for get the email.
   */
  public get email() {
    return this.userForm.get('email');
  }

  /**
 * Method for get the email.
 */
  public get ci() {
    return this.userForm.get('ci');
  }

  /**
     * Method for get the city.
     */

  public get address() {
    return this.userForm.get('address');
  }

  /**
   * Method for get the role.
   */
  public get role() {
    return this.userForm.get('role');
  }

  /**
     * Method for get the role.
     */
  public get color() {
    return this.userForm.get('color');
  }

  reset() {
    this.userForm.reset();
  }
}
