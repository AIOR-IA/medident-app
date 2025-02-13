import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ColorsType, shortenBlankSpaces, TypeRole, validationPatternEmail, validationPatternNames, validationPatternPassword, ValidationPhone } from 'src/app/shared/utils/validation.utils';
import { UserService } from '../services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef } from '@angular/material/dialog';
import { passwordMatchValidator } from 'src/app/shared/custom-validation-password/custom-validation-password';
import { RoleType } from 'src/app/shared/enums/roleUser.type.enum';
import { RoleUser } from '../interfaces/user.interface';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss']
})
export class CreateUserComponent implements OnInit{
  public userForm: FormGroup;
  public TypeRole = TypeRole;
  public ColorType = ColorsType;

  public hasAccount: boolean = false;
  public changePasswordFields: boolean = false;

  private fb = inject(FormBuilder);;
  private userService = inject(UserService);
  private snakBar = inject(MatSnackBar);
  public dialogRef = inject(MatDialogRef<CreateUserComponent>);

  constructor(

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
      password: ['',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(10),
          Validators.pattern(validationPatternPassword),
        ]
      ],
      address: ['', [
        Validators.required,
        Validators.maxLength(100),
      ]],
      confirmPassword: ['',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(10),
          Validators.pattern(validationPatternPassword)
        ]
      ],
    },
      {
        validator: passwordMatchValidator(
          'password',
          'confirmPassword'
        )
      });
  }

  /**
   * This method is to create a new User.
   */
  public saveUser() {
    if (this.userForm.valid) {
      this.trimValues();
      this.shortenBlankSpaces();
      // this.userService.createUser(this.userForm.value).subscribe(
      //   (data) => {
      //     this.openSnakBar('Usuario creado', 'Aceptar');
      //     this.dialogRef.close(data);
      //   },
      //   (error) => this.openSnakBar('Usuario existente, verifique el usuario o email', 'Aceptar')
      // );

      const firstName = this.userForm.get('firstName')!.value as string;
      const lastName = this.userForm.get('lastName')!.value as string;
      const phoneNumber = this.userForm.get('phoneNumber')!.value as string;
      const email = this.userForm.get('email')!.value as string;
      const ci = this.userForm.get('ci')!.value as string;
      const address = this.userForm.get('address')!.value as string;
      const role = this.userForm.get('role')!.value as RoleType;
      const color = this.userForm.get('color')!.value as string;
      const password = this.userForm.get('password')!.value as string;
      this.userService.createUser({ firstName, lastName, phoneNumber, email, ci, address, role, color, password })
        .then((data) => {
          console.log({ data });
          this.reset();
          this.openSnakBar('Usuario creado', 'Aceptar');
          // this.dialogRef.close(data);
        })
        .catch((error) => {
          this.openSnakBar('Usuario existente, verifique el correo', 'Aceptar');
        });
    }
    else {
      this.userForm.markAllAsTouched();
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
    this.userForm.patchValue({
      firstName: this.userForm.get('firstName')!.value.trim(),
      lastName: this.userForm.get('lastName')!.value.trim(),
      telefono: this.userForm.get('phoneNumber')!.value.trim(),
      email: this.userForm.get('email')!.value.trim(),
      ci: this.userForm.get('ci')!.value.trim(),
      address: this.userForm.get('address')!.value.trim(),
      password: this.userForm.get('password')!.value.trim(),
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
      password: shortenBlankSpaces(this.userForm.get('password')!.value),
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


  /**
   * Method for get the password.
   */
  public get password() {
    return this.userForm.get('password');
  }

  /**
   * Method for get confirm password.
   */
  public get confirmPassword() {
    return this.userForm.get('confirmPassword');
  }

  reset() {
    this.userForm.reset();
  }
}
