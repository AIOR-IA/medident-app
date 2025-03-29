import { ProductResponse } from "src/app/calendar/interfaces/product-response.interface";

export type statusTreatment = 'finished' | 'review' | 'canceled' | 'inprogress';

export interface Treatment {
  // idTreatment: string;
  idPatient: string;
  createdAt?: Date;
  products: ProductResponse[];
  budget: number;
  idDoc?:string;
  debt: number;
  status: statusTreatment;
  onAccount: number;
}
