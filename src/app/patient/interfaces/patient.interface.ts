export type StatusPatient = 'canceled' | 'completed' | 'installment ';
export interface Patient {
  //change UUID
  firstName: string;
  lastName: string;
  ci: string;
  age: number;
  createdAt?: Date;
  phoneNumber: string;
  amount: number;
  status?: StatusPatient;
  uid?: string
  idDoc?: string;

}

