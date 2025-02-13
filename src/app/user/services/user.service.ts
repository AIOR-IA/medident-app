import { inject, Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, sendPasswordResetEmail, updatePassword, } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map, Observable, of, Subscription, switchMap } from 'rxjs';
import { User } from '../interfaces/user.interface';
import { v4 as uuidv4 } from 'uuid';
import { CreateUserModel } from '../interfaces/create-user.model';
import { UserModel } from '../interfaces/user.model';
import { QueryConstraint, orderBy as firebaseOrderBy, query, doc, Firestore, collection, collectionData, orderBy, addDoc, updateDoc, where } from '@angular/fire/firestore';
@Injectable({
  providedIn: 'root'
})
export class UserService {

  private auth = inject(Auth);
  public firestore = inject(Firestore);

  private userSubscription!: Subscription;
  private _user!: User | null;
  constructor() { }

  createUser(user: User) {
    const { firstName, lastName, ci, email, phoneNumber, color, address, role, password, } = user;
    const uuid = uuidv4();
    console.log({ email, password });
    return createUserWithEmailAndPassword(this.auth, email, password)
      .then((data) => {
        const newUser = new CreateUserModel(firstName, lastName, ci, email, phoneNumber, color, address, role, password, data.user.uid);
        const usersRef = collection(this.firestore, 'users');
        return addDoc(usersRef, { ...newUser });
      }
      )
      .catch(error => {
        console.log(error);
      })
  }

  getAllUsersObs(namePrefix = ''): Observable<User[]> {
    let startAt = namePrefix;
    let endAt = namePrefix + '\uf8ff';
    const usersRef = collection(this.firestore, 'users');
    let q;
    if (namePrefix === '') {
      q = query(
        usersRef,
        orderBy('firstName'),
      );
    }
    else {
      q = query(
        usersRef,
        orderBy('firstName'),
        where('firstName', '>=', startAt),
        where('firstName', '<=', endAt)
      );
    }
    return collectionData(q, { idField: 'idDoc' }).pipe(map((data: any[]) => data.map(item => item as User)));
  }
  private pageSize = 2;

  // Función para obtener usuarios paginados
  // getAllUsersPaginated(startAfter?: any): Observable<User[]> {
  //   return this.firestore.collection<User>('users', ref => {
  //     let query = ref.orderBy('uid'); // Ordena por el campo 'uid'
  //     if (startAfter) {
  //       query = query.startAfter(startAfter);
  //     }
  //     return query.limit(this.pageSize);
  //   }).valueChanges({ idField: 'uid' });
  // }

  // Función para obtener la primera página de usuarios
  // getFirstPage(): Observable<User[]> {
  //   return this.getAllUsersPaginated();
  // }

  // // Función para obtener la siguiente página de usuarios
  // getNextPage(lastDocument: User): Observable<User[]> {
  //   return of(lastDocument).pipe(
  //     switchMap(lastDoc => this.getAllUsersPaginated(lastDoc))
  //   );
  // }

  get user() {
    return this._user;
  }

  public updateStatusUser(id: string, status: boolean): Promise<void> {
    const docRef = doc(this.firestore, `users/${id}`);
    return updateDoc(docRef, {
      isActive: status
    })
  }

  public updateUser(user: User): Promise<void> {
    const docRef = doc(this.firestore, `users/${user.idDoc}`);
    return updateDoc(docRef, { ...user });
  }

  public async resetPassword(email: string): Promise<void> {
    console.log({ email });
    try {
      return await sendPasswordResetEmail(this.auth, email);
    } catch (error) {
      throw error;
    }
  }
}
