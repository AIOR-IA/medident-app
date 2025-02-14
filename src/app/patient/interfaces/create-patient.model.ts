import { StatusPatient } from "./patient.interface";

export class CreatePatientModel {
  public firstName: string;
  public lastName: string;
  public ci: string;
  public age: number;
  public createdAt: Date;
  public phoneNumber: string;
  public amount: number;
  public status?: StatusPatient;

  constructor(firstName: string, lastName:string, ci: string, age:number, phoneNumber: string, amount: number, status: StatusPatient) {
    this.firstName = firstName.toLowerCase();
    this.lastName = lastName.toLowerCase();
    this.ci = ci;
    this.age = age;
    this.createdAt = new Date();
    this.phoneNumber = phoneNumber;
    this.amount = amount;
    this.status = status;
  }
}
