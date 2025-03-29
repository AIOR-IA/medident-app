import { NgModule, OnInit } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from './material/material.module';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { environment } from '../environments/environment';
import { UserModule } from './user/user.module';
import { AuthService } from './auth/services/auth.service';
@NgModule({
  declarations: [
    AppComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    UserModule,
    AngularFirestoreModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),

    provideFirebaseApp(() => initializeApp({ "projectId": "medident-app-f25a2", "appId": "1:138784398253:web:90e838447b8f1a1d5f5f24", "storageBucket": "medident-app-f25a2.firebasestorage.app", "apiKey": "AIzaSyDj9lqfAlVplioi_PHaLOVZE3iBcl4zNq8", "authDomain": "medident-app-f25a2.firebaseapp.com", "messagingSenderId": "138784398253" })),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule implements OnInit {
  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.authService.loadCurrentUser();
  }
}
