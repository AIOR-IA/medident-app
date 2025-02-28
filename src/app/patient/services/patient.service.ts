import { inject, Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { addDoc, collection, collectionData, doc, Firestore, getDocs, orderBy, query, updateDoc, where, Timestamp, increment } from '@angular/fire/firestore';
import { Patient } from '../interfaces/patient.interface';
import { CreatePatientModel } from '../interfaces/create-patient.model';
import { catchError, map, Observable } from 'rxjs';
import { Treatment } from '../interfaces/treatment.interface';
import { CreateTreatmentModel } from '../interfaces/create-treatment.model';
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

  createTreatment(treatment: Treatment) {
    const { idPatient, products, budget, debt } = treatment;
    const newTreatment = new CreateTreatmentModel(idPatient, products, budget, debt);

    // Referencia a la subcolección dentro del paciente
    const treatmentsRef = collection(this.firestore, `treatments/${idPatient}/records`);
    // Crear un nuevo documento con un ID generado automáticamente
    return addDoc(treatmentsRef, {...newTreatment} ).then((docRef) => {
        const treatmentId = docRef.id;
        // Referencia al documento recién creado para actualizarlo con su ID
        const treatmentDocRef = doc(this.firestore, `treatments/${idPatient}/records/${treatmentId}`);
        return updateDoc(treatmentDocRef, { idDoc: treatmentId }).then(() => ({
          ...treatment,
          'idDoc': treatmentId
        })).catch(error => catchError(error));
      });
  }

  getAllTreatments(idPatient: string): Promise<Treatment[]> {
    const treatmentsRef = collection(this.firestore, `treatments/${idPatient}/records`);
    const q = query(
      treatmentsRef,
      orderBy('createdAt', 'desc') // Ordenar por 'createdAt' de mayor a menor
    );

    return getDocs(q) // Convertimos a una promesa con getDocs
      .then(snapshot => {
        return snapshot.docs.map(doc => {
          const data = doc.data() as Treatment;
          return {
            ...data,
            createdAt: (data.createdAt as unknown as Timestamp).toDate(), // Convertir Timestamp a Date
            idDoc: doc.id
          };
        });
      });
  }

  updateTreatmentDebt(idPatient: string, idRecord: string, pay: number): Promise<void> {
    const recordRef = doc(this.firestore, `treatments/${idPatient}/records/${idRecord}`);

    // Solo retorna la promesa sin manejar errores aquí
    return updateDoc(recordRef, { debt: increment(-pay) });
  }
}
