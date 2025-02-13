export type RoleUser = 'admin' | 'user';
export interface User {
  //change UUID
  uid?: string
  firstName: string;
  lastName: string;
  ci: string;
  email: string;
  phoneNumber: string;
  totalEvents?: number;
  color:string;
  isActive?: boolean;
  createdAt?: Date;
  address: string;
  role: RoleUser;
  password?: string;
  idDoc?: string;
}
