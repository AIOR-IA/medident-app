import { Timestamp } from '@angular/fire/firestore';
import { TreatmentProductResponse } from './treatment-response.interface';

export interface Event {
  // id: string
  title: string;
  start: Timestamp;
  end: Timestamp;
  backgroundColor?: string;
  idDoc?: string;
  idDocUser?: string;
  idDocPatient?: string;
  idDocRecords?: string;
  products: TreatmentProductResponse[];
}
