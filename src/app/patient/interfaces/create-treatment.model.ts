import { Product } from "src/app/product/interfaces/product.interface";
import { statusTreatment } from "./treatment.interface";
import { Timestamp } from 'firebase/firestore';
import { ProductResponse } from "src/app/calendar/interfaces/product-response.interface";
export class CreateTreatmentModel {
    idPatient: string;
    products: ProductResponse[];
    budget: number;
    debt: number;
    status: statusTreatment;
    createdAt: Date;
    idDoc?:string;

  constructor(idPatient: string, products:ProductResponse[], budget: number, debt:number) {
    this.idPatient = idPatient;
    this.products = products;
    this.budget = budget;
    this.debt = debt;
    this.createdAt = new Date();
    this.status = 'review';
  }
}
