import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
// import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { validationPatternEmail, validationPatternPassword } from 'src/app/shared/utils/validation.utils';
@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm!: UntypedFormGroup;
  private fb = inject(FormBuilder);
  hide = true;

  constructor(
    // private authService: AuthenticationService,
    private router: Router,
    // private snakBar: MatSnackBar
  ) { }

  public ngOnInit(): void {
    // if (this.authService.isLogged() && this.authService.isLoggedAndAllowed()) {
    //   this.router.navigate(['vehicles']);
    // }

    this.loginForm = this.fb.group({
      email: new FormControl('', [Validators.required, Validators.pattern(validationPatternEmail)]),
      password: new FormControl('', [Validators.required, Validators.pattern(validationPatternPassword)])
    });
  }

  public login(): void {
    if(this.loginForm.invalid) {
      console.log(this.loginForm.value);
      this.loginForm.markAllAsTouched();
      return;
    }
    if (this.loginForm.valid) {
      console.log(this.loginForm.value);
      this.trimValues();
      // this.authService.getToken(this.loginForm.value).pipe(
      //   map(token => this.router.navigate(['vehicles']))
      // ).subscribe(
      //   (data) => this.openSnakBar('Inicio de sesión correcto', 'Aceptar'),
      //   (error) => this.openSnakBar('Nombre de usuario o contraseña incorrecto', 'Aceptar')
      // );
    }
  }

  private openSnakBar(message: string, action: string): void {
    // this.snakBar.open(message, action, { duration: 3000 });
  }

  private trimValues() {
    this.loginForm.patchValue({
      email: this.loginForm.get('email')?.value.trim(),
      password: this.loginForm.get('password')?.value.trim()
    })
  }

  get passwordInput() { return this.loginForm.get('password'); }
}
