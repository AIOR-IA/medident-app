import { inject, Injectable, OnInit } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from '@angular/fire/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { BehaviorSubject, map } from 'rxjs';
import { User } from 'src/app/user/interfaces/user.interface';
import { UserService } from 'src/app/user/services/user.service';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private auth = inject(Auth);
  private authfire = inject(AngularFireAuth);

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private userService: UserService) {
    this.loadCurrentUser();
  }

  setCurrentUser(user: User): void {
    this.currentUserSubject.next(user);
    localStorage.setItem('currentUser', JSON.stringify(user.email));
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value; // 🔹 Retorna el valor actual del usuario
  }

  async loadCurrentUser(): Promise<void> {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      const email = JSON.parse(storedUser);
      const user = await this.userService.getUserByEmail(email) as User;
      if (user) {
        this.currentUserSubject.next(user); // 🔹 Actualiza el BehaviorSubject
      }
    }
  }


  loginUser(email: string, password: string) {
    return this.authfire.signInWithEmailAndPassword(email, password);
  }

  isAuth() {
    return this.authfire.authState.pipe(
      map(user => user != null)
    )
  }

  currentUserFirebase() {
    return this.authfire.currentUser;
  }

  logout() {
    return this.auth.signOut();
  }
}
