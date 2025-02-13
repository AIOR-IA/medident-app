import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
// import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { validationPatternEmail, validationPatternPassword } from 'src/app/shared/utils/validation.utils';
import { AuthService } from '../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm!: UntypedFormGroup;
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private snakBar = inject(MatSnackBar);
  private router = inject(Router);
  hide = true;

  constructor() { }

  public ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: new FormControl('', [Validators.required, Validators.pattern(validationPatternEmail)]),
      password: new FormControl('', [Validators.required, Validators.pattern(validationPatternPassword)]),
    });
  }

  public login(): void {
    if(this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    if (this.loginForm.valid) {
      this.trimValues();
      this.authService.loginUser(this.loginForm.value.email, this.loginForm.value.password).then(
        (data) => {
          this.openSnakBar('Inicio de sesión correcto', 'Aceptar'),
          this.router.navigate(['calendar']);
        },
        (error) => {
          this.openSnakBar('Nombre de correo o contraseña incorrecto', 'Aceptar');
        }
      );

    }
  }

  private openSnakBar(message: string, action: string): void {
    this.snakBar.open(message, action, {duration: 3000});
  }

  private trimValues() {
    this.loginForm.patchValue({
      email: this.loginForm.get('email')?.value.trim(),
      password: this.loginForm.get('password')?.value.trim()
    })
  }

  get passwordInput() { return this.loginForm.get('password'); }


}
