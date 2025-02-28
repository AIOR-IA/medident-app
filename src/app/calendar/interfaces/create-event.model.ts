
import { Timestamp } from '@angular/fire/firestore';
import { TreatmentProductResponse } from './treatment-response.interface';
export class CreateEventModel {
  public title: string;
  public start: Timestamp;
  public end: Timestamp;
  public backgroundColor: string;
  public idDoc: string;
  public idDocUser?: string;
  public idDocPatient?: string;
  public idDocRecords?: string;
  public products: TreatmentProductResponse[];
  constructor(title: string, start: Timestamp, end: Timestamp, backgroundColor: string, idDocUser: string, idDocPatient: string, idDocRecords: string, products: TreatmentProductResponse[]) {
    this.title = title;
    this.start = start;
    this.end = end;
    this.backgroundColor = backgroundColor;
    this.idDocUser = idDocUser;
    this.idDocPatient = idDocPatient;
    this.idDocRecords = idDocRecords;
    this.products = products;
  }
}
