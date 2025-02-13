import { inject, Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from '@angular/fire/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { map } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private auth = inject(Auth);
  private authfire = inject(AngularFireAuth);

  constructor() { }

  loginUser(email: string, password : string) {
    return this.authfire.signInWithEmailAndPassword(email, password);
  }
  isAuth() {
    return this.authfire.authState.pipe(
      map(user => user != null)
    )
  }

  currentUser() {
    return this.authfire.currentUser;
  }

  logout() {
    return this.auth.signOut();
  }
}
