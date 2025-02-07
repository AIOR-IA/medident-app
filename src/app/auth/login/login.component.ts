import { Component } from '@angular/core';
import { FormControl, FormGroup, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
// import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm!: UntypedFormGroup;
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
    this.loginForm = new UntypedFormGroup({
      username: new UntypedFormControl(null, [Validators.required]),
      password: new UntypedFormControl(null, [Validators.required])
    });
  }

  public login(): void {
    if (this.loginForm.valid) {
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
      username: this.loginForm.get('username')?.value.trim(),
      password: this.loginForm.get('password')?.value.trim()
    })
  }

  get passwordInput() { return this.loginForm.get('password'); }
}
