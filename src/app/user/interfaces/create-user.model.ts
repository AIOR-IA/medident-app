import { RoleUser } from "./user.interface";


export class CreateUserModel {
  public firstName: string;
  public lastName: string;
  public ci: string;
  public email: string;
  public phoneNumber: string;
  public totalEvents: number;
  public color: string;
  public isActive: boolean;
  public createdAt: Date;
  public address: string;
  public role: RoleUser;
  public password: string;
  public uid?: string;

  constructor(firstName: string, lastName:string, ci: string, email: string, phoneNumber: string, color: string, address:string, role: RoleUser, password:string, uid:string) {
    this.firstName = firstName.toLowerCase();
    this.lastName = lastName.toLowerCase();
    this.ci = ci;
    this.email = email;
    this.phoneNumber = phoneNumber;
    this.totalEvents = 0;
    this.color = color;
    this.isActive = true;
    this.createdAt = new Date();
    this.address = address.toLowerCase();
    this.role = role;
    this.password = password;
    this.uid = uid;
  }
}
