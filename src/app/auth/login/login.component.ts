import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
// import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { validationPatternEmail, validationPatternPassword } from 'src/app/shared/utils/validation.utils';
import { AuthService } from '../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from 'src/app/user/services/user.service';
import { User } from 'src/app/user/interfaces/user.interface';
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
  private userService = inject(UserService);
  hide = true;

  constructor() { }

  public ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: new FormControl('', [Validators.required, Validators.pattern(validationPatternEmail)]),
      password: new FormControl('', [Validators.required, Validators.pattern(validationPatternPassword)]),
    });
  }

  public async login(): Promise<void> {
    if(this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    if (this.loginForm.valid) {
      this.trimValues();
      try {
        const data = await this.authService.loginUser(
          this.loginForm.value.email,
          this.loginForm.value.password
        );

        this.openSnakBar('Inicio de sesión correcto', 'Aceptar');

        // ✅ Espera a que getUserByEmail termine y asigne el resultado a user
        const user = await this.userService.getUserByEmail(data.user.email) as User;

        if (user) {
          this.authService.setCurrentUser(user);
          console.log('Usuario seteado:', user);
        }

        this.router.navigate(['calendar']); // 🔹 Solo se ejecuta después de obtener el usuario

      } catch (error) {
        this.openSnakBar('Nombre de correo o contraseña incorrecto', 'Aceptar');
      }

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
