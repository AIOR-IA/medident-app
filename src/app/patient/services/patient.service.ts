import { inject, Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { addDoc, collection, collectionData, doc, Firestore, orderBy, query, updateDoc, where } from '@angular/fire/firestore';
import { Patient } from '../interfaces/patient.interface';
import { CreatePatientModel } from '../interfaces/create-patient.model';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  private auth = inject(Auth);
  public firestore = inject(Firestore);

  createPatient(patient: Patient) {
    const { firstName, lastName, ci, phoneNumber, age, amount } = patient;
    const newPatient = new CreatePatientModel(firstName, lastName, ci, age, phoneNumber, amount, 'completed');
    const patientsRef = collection(this.firestore, 'patients');
    // return addDoc(patientsRef, { ...newPatient });

    return addDoc(patientsRef, { ...newPatient }).then((docRef) => {
      const patientId = docRef.id;

      const patientDocRef = doc(this.firestore, `patients/${patientId}`);
      return updateDoc(patientDocRef, { idDoc: patientId }).then(() => ({ ...newPatient, 'idDoc': patientId }));
    });
  }


  getAllPatientsObs(namePrefix = ''): Observable<Patient[]> {
    let startAt = namePrefix;
    let endAt = namePrefix + '\uf8ff';
    const patientsRef = collection(this.firestore, 'patients');
    let q;
    if (namePrefix === '') {
      q = query(
        patientsRef,
        orderBy('firstName'),
      );
    }
    else {
      q = query(
        patientsRef,
        orderBy('firstName'),
        where('firstName', '>=', startAt),
        where('firstName', '<=', endAt)
      );
    }
    return collectionData(q, { idField: 'idDoc' }).pipe(map((data: any[]) => data.map(item => item as Patient)));
  }

  public updatePatient(patient: Patient): Promise<void> {
    const docRef = doc(this.firestore, `patients/${patient.idDoc}`);
    return updateDoc(docRef, { ...patient });
  }
}
