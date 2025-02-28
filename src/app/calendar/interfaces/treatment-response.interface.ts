export interface TreatmentProductResponse {
  name: string;
  price: number;
  createdAt?: Date;
  idDoc?: string;
  quantity: number;
  done: number;
  toDo?: number
}
