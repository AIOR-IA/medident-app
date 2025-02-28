import { inject, Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { Event } from '../interfaces/event.interface';
import { CreateEventModel } from '../interfaces/create-event.model';
import { addDoc, collection, deleteDoc, doc, endBefore, Firestore, getDoc, getDocs, query, Timestamp, updateDoc, where } from '@angular/fire/firestore';
import { createEventId } from '../../shared/utils/event.utils';
import { Treatment } from 'src/app/patient/interfaces/treatment.interface';
import { TreatmentProductResponse } from '../interfaces/treatment-response.interface';

export interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  backgroundColor?: string;
}


@Injectable({
  providedIn: 'root'
})
export class CalendarService {

  public firestore = inject(Firestore);

  constructor() { }

  // createEvent(event: Event) {

  //   const {  start, end, title, backgroundColor,idDocPatient, idDocRecords, idDocUser, products } = event;

  //   const newEvent = new CreateEventModel(title, start, end, backgroundColor, idDocUser, idDocPatient, idDocRecords, products);
  //   const eventsRef = collection(this.firestore, 'events');

  //   return addDoc(eventsRef, { ...newEvent }).then((docRef) => {
  //     const eventId = docRef.id;

  //     const productDocRef = doc(this.firestore, `events/${eventId}`);
  //     return updateDoc(productDocRef, { idDoc: eventId }).then(() => ({ ...newEvent, 'idDoc': eventId })).then(() => {
  //       const treatmentDocRef = doc(this.firestore, `treatments/${idDocPatient}/records/${idDocRecords}`);
  //       await this.updateTreatmentProducts()...CalendarService.
  //     );
  //   });
  // };

  async createEvent(event: Event) {
    const { start, end, title, backgroundColor, idDocPatient, idDocRecords, idDocUser, products } = event;

    const newEvent = new CreateEventModel(title, start, end, backgroundColor, idDocUser, idDocPatient, idDocRecords, products);
    const eventsRef = collection(this.firestore, 'events');

    try {
      // 1️⃣ Agregar el evento a Firestore
      const docRef = await addDoc(eventsRef, { ...newEvent });
      const eventId = docRef.id;

      // 2️⃣ Actualizar el evento con su ID generado
      const eventDocRef = doc(this.firestore, `events/${eventId}`);
      await updateDoc(eventDocRef, { idDoc: eventId });

      // 3️⃣ Actualizar los productos en el tratamiento después de crear el evento
      await this.updateTreatmentProducts(idDocPatient, idDocRecords, products);

      // 4️⃣ Retornar el evento actualizado con ID
      return { ...newEvent, idDoc: eventId };
    } catch (error) {
      throw error;
    }
  }

  async updateTreatmentProducts(idDocPatient: string, idDocRecords: string, products: TreatmentProductResponse[]) {
    const treatmentDocRef = doc(this.firestore, `treatments/${idDocPatient}/records/${idDocRecords}`);

    try {
      const treatmentSnapshot = await getDoc(treatmentDocRef);
      if (!treatmentSnapshot.exists()) {
        throw new Error('El tratamiento no existe');
      }

      let treatmentData = treatmentSnapshot.data() as Treatment;
      let updatedProducts = treatmentData.products.map(product => {
        let matchingEventProduct = products.find(p => p.idDoc === product.idDoc);
        if (matchingEventProduct) {
          return { ...product, done: (product.done || 0) + (matchingEventProduct.toDo || 0) };
        }
        return product;
      });

      await updateDoc(treatmentDocRef, { products: updatedProducts });
    } catch (error) {
      throw error;
    }
  }

  async getEventsByRecordId(idDocRecords: string): Promise<Event[]> {
    try {
      const eventsRef = collection(this.firestore, 'events');
      const q = query(eventsRef, where('idDocRecords', '==', idDocRecords));
      const querySnapshot = await getDocs(q);

      // Mapear los datos de los documentos a objetos Event
      return await querySnapshot.docs.map(doc => ({
        idDoc: doc.id,
        ...doc.data()
      } as Event));
    } catch (error) {
      throw error;
    }
  }

  async getEventById(idEvent: string): Promise<Event | null> {
    const eventDocRef = doc(this.firestore, `events/${idEvent}`);

    try {
      const eventSnapshot = await getDoc(eventDocRef);
      if (!eventSnapshot.exists()) {
        return null;
      }

      const eventData = eventSnapshot.data();
      return { idDoc: idEvent, ...eventData } as Event;
    } catch (error) {
      throw error;
    }
  }


  async deleteTreatmentProducts(
    idDocPatient: string,
    idDocRecords: string,
    products: TreatmentProductResponse[],
    idEvent: string
  ) {
    const treatmentDocRef = doc(this.firestore, `treatments/${idDocPatient}/records/${idDocRecords}`);
    const eventDocRef = doc(this.firestore, `events/${idEvent}`); // Referencia del evento

    try {
      const treatmentSnapshot = await getDoc(treatmentDocRef);
      if (!treatmentSnapshot.exists()) {
        throw new Error('El tratamiento no existe');
      }

      let treatmentData = treatmentSnapshot.data() as Treatment;

      // Recorrer los productos del tratamiento y restar el `toDo` correspondiente en `done`
      let updatedProducts = treatmentData.products.map(product => {
        const matchingEventProduct = products.find(p => p.idDoc === product.idDoc);
        if (matchingEventProduct) {
          return { ...product, done: Math.max((product.done || 0) - (matchingEventProduct.toDo || 0), 0) };
        }
        return product;
      });

      // Actualizar el documento del tratamiento con los valores corregidos
      await updateDoc(treatmentDocRef, { products: updatedProducts });

      // Eliminar el evento después de actualizar el tratamiento
      await deleteDoc(eventDocRef);
    } catch (error) {
      throw error;
    }
  }
  // createEvent(event: Event) {
  //   const { start, end, title, backgroundColor, idDocPatient, idDocRecords, idDocUser, products } = event;

  //   const newEvent = new CreateEventModel(title, start, end, backgroundColor, idDocUser, idDocPatient, idDocRecords, products);
  //   const eventsRef = collection(this.firestore, 'events');

  //   return addDoc(eventsRef, { ...newEvent }).then((docRef) => {
  //     const eventId = docRef.id;
  //     const eventDocRef = doc(this.firestore, `events/${eventId}`);

  //     // Actualizar el evento con su ID
  //     return updateDoc(eventDocRef, { idDoc: eventId }).then(() => {

  //       // 🔹 1. Obtener la referencia del tratamiento en Firestore
  //       const treatmentDocRef = doc(this.firestore, `treatments/${idDocPatient}/records/${idDocRecords}`);

  //       return getDoc(treatmentDocRef).then((treatmentSnapshot) => {
  //         if (!treatmentSnapshot.exists()) {
  //           throw new Error('El tratamiento no existe');
  //         }

  //         // 🔹 2. Obtener los productos actuales del tratamiento
  //         let treatmentData = treatmentSnapshot.data() as Treatment;
  //         let updatedProducts = treatmentData.products.map(product => {
  //           let matchingEventProduct = products.find(p => p.idDoc === product.idDoc);
  //           if (matchingEventProduct) {
  //             return { ...product, done: (product.done || 0) + (matchingEventProduct.toDo || 0) };
  //           }
  //           return product;
  //         });

  //         // 🔹 3. Actualizar los productos en el tratamiento
  //         return updateDoc(treatmentDocRef, { products: updatedProducts }).then(() => ({
  //           ...newEvent,
  //           idDoc: eventId
  //         }));
  //       });
  //     });
  //   });
  // }


  async getAllEvents(startDate: Date, endDate: Date): Promise<Event[]> {

    const eventsRef = collection(this.firestore, 'events');

    const startTimestamp = Timestamp.fromDate(startDate);
    const endTimestamp = Timestamp.fromDate(endDate);

    const q = query(
      eventsRef,
      where('start', '>=', startDate),
      where('start', '<=', endDate)
    );

    const querySnapshot = await getDocs(q);
    return await querySnapshot.docs.map(doc => doc.data() as Event);
  }
}
