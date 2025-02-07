import { Component } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Patient } from '../interfaces/patient.interface';

@Component({
  selector: 'list-patients',
  templateUrl: './list-patients.component.html',
  styleUrls: ['./list-patients.component.scss']
})
export class ListPatientsComponent {
tableColumns: string[] = ['userFullName', 'userUsername', 'userEmail', 'userRole', 'userStatus', 'userCity', 'userActions'];
  public users = new MatTableDataSource<Patient>();
  public cities: any = [];
  // public RoleType = RoleUser;

  public orderFullName: string = 'DESC';
  public orderUsername: string = 'DESC';
  public orderRole: string = 'DESC';
  public orderStatus: string = 'DESC';
  public orderEmail: string = 'DESC';
  public orderCity: string = 'DESC';
  public pageSize: number = 0;
  public pageLength: number = 0;
  public pageIndex: number = 0;
  public size: any;

  public statuses = {
    fullName: false,
    username: false,
    email:false,
    role: false,
    status: false,
    city:false
  };
  public params = {
    orderBy: null,
    orderSort: null,
    firstName: null,
    email: null,
    lastName: null,
    username: null,
    role: null,
    status: null,
    city: null
  };

  public orderStatuses = {
    fullName: 0,
    username: 0,
    email: 0,
    role: 0,
    status: 0,
    city: 0
  }

  constructor(
    // private userService: UserService,
    // private cityService: CityService,
    // private snakBar: MatSnackBar,
    // public dialog: MatDialog
  ) { }

  // @ViewChild(MatPaginator) paginator: MatPaginator;

  ngOnInit(): void {
    this.getCities();
    this.getUsers();
    this.pageSize = 10;
  }

  ngAfterViewInit(): void {
    // this.users.paginator = this.paginator;
  }

  /**
   * Method to get all the cities
   */
  public getCities() {
    // this.cityService.getCities().subscribe(cities => {
    //   this.cities = cities;
    // });
  }

  /**
   * Method to get all the users
   */
  public getUsers() {
    // this.size = this.pageSize;
    // this.pageSize = 0;
    // this.userService.getUsers(this.params, this.pageSize)
    //   .subscribe((res:any) => {
    //     this.users.data = res.items;
    //     this.pageLength = res.meta.totalItems;
    //   });
    // this.pageSize = this.size;
  }

  /**
   * Method to open the page create user
   */
  public goToCreateUser() {
    // const dialogCreateRef = this.dialog.open(CreateUserComponent);
    // dialogCreateRef.afterClosed().subscribe(result => {
    //   result && this.getUsers();
    // });
  }

  /**
   * Method to change the page size of the user paginator.
   * @param pageEvent The PageEvent containing the new page size and length of the paginator.
   */
  public changeSize(pageEvent: PageEvent) {
    // this.pageSize = pageEvent.pageSize;
    // this.users.paginator.length = pageEvent.length;
  }

  /**
   * Method for showing a custom message.
   * @param message The message to display in the snack bar.
   * @param action The label for the action button in the snack bar.
  */
  openSnakBar(message: string, action: string): void {
    // this.snakBar.open(message, action, {duration: 3000});
    // this.getUsers();
  }

  /**
   * This method displays a message to the user based on the type of error.
   * @param error receive the kind of error
   */
  private handleError(error: Response | any) {
    if (error == 'El valor de clave duplicado viola la restricción de unicidad') {
      this.openSnakBar('Error: Usuario existente, verifique el usuario o email', 'Aceptar');
    } else {
      this.openSnakBar('No se pudo cambiar el estado al usuario, inténtelo más tarde', 'Aceptar');
    }
  }

  /**
   * Asigna un atributo y orden de clasificación y devuelve el nuevo orden.
   * @param attribute - El atributo por el que se va a clasificar.
   * @param orderSort - El orden de clasificación (ASC o DESC).
   * @returns  El nuevo orden de clasificación.
   */
  public setSort(attribute: string, orderSort: any) {
    this.assignAttributesSort(attribute, orderSort);
    // return this.resetOrderSort(attribute, orderSort);
  }

  /**
   * Method to sort the list of users by the specified attribute.
   * @param attribute Receive the kind of attribute for sorting
   */
  // public sort(attribute) {
  //   this.orderStatuses[attribute] += 1;
  //   var typeSorts = {
  //     firstName: (attribute) =>
  //       (this.orderFullName = this.setSort(attribute, this.orderFullName)),
  //     username: (attribute) =>
  //       (this.orderUsername = this.setSort(attribute, this.orderUsername)),
  //     email: (attribute) =>
  //       (this.orderEmail = this.setSort(attribute, this.orderEmail)),
  //     role: () =>
  //       (this.orderRole = this.setSort(attribute, this.orderRole)),
  //     status: (attribute) =>
  //       (this.orderStatus = this.setSort(attribute, this.orderStatus)),
  //     city: (attribute) =>
  //       (this.orderCity = this.setSort(attribute, this.orderCity)),
  //   };
  //   typeSorts[attribute](attribute);
  //   this.getUsers();
  // }

  /**
   * Method to assign the attribute and order to the parameters used for sorting the list of users.
   * @param attribute The attribute to sort by.
   * @param orderSort The order in which to sort the attribute.
   */
  private assignAttributesSort(attribute: any, orderSort: any) {
    this.params.orderBy = attribute;
    this.params.orderSort = orderSort;
  }

  /**
   * Method to reset the order of the list of users based on the given attribute and order.
   * @param attribute The attribute to reset the order by.
   * @param orderSort The order to reset.
   * @returns The new order after the reset.
   */
  // private resetOrderSort(attribute, orderSort) {
  //   const maxClick = 3;
  //   let newOrderSort = orderSort;
  //   if (this.orderStatuses[attribute] === maxClick) {
  //     this.params.orderSort = null;
  //     this.params.orderBy = null;
  //     this.orderStatuses[attribute] = 0;
  //     newOrderSort = 'DESC'
  //     this.statuses[attribute] = false;
  //   } else {
  //     newOrderSort = this.changeOrderSort(orderSort);
  //     this.changeStatuses(attribute);
  //   }
  //   return newOrderSort;
  // }

  /**
   * Method to change the order of the list of users based on the given order.
   * @param orderSort The order to change.
   * @returns The new order after the change.
   */
  // private changeOrderSort(orderSort) {
  //   return (orderSort === 'DESC') ? this.params.orderSort = 'ASC' : this.params.orderSort = 'DESC';
  // }

  /**
   * Method to change the statuses of the list of users based on the given attribute.
   * @param attribute The attribute to use as the basis for changing the statuses.
   */
  // private changeStatuses(attribute) {
  //   Object.keys(this.statuses).forEach(state => {
  //     this.statuses[state] = state === attribute;
  //   });
  // }

  /**
    * Updates the status of a user and opens a confirmation dialog modal.
    * @param user The user to update the status for.
   */
  // public updateStatus(user: User) {
  //   const message = user.status === 1 ? `¿Deseas cambiar el estado a INACTIVO al usuario ${user.username}?` : `¿Deseas cambiar el estado a ACTIVO al usuario ${user.username}?`;
  //   const confirm = user.status === 1 ? 'Deshabilitar' : 'Habilitar';
  //   const statusChange = user.status === 1 ? 0 : 1;
  //   const dialogRef = this.dialog.open(ConfirmDialogComponent, {
  //     width: '430px',
  //     data: {
  //       title: 'Actualizar Estado ',
  //       description: message,
  //       btnCancel: { text: 'Cancelar', class: ClassButtonType.Black },
  //       btnConfirm: { text: confirm, class: ClassButtonType.Delete },
  //     },
  //   });

  //   dialogRef.afterClosed().subscribe((result) => {
  //     if (result) {
  //       this.userService.updateStatusUser(user.id, statusChange).subscribe(
  //         () => {
  //           this.openSnakBar('Usuario actualizado correctamente', 'Aceptar');
  //           this.getUsers();
  //         },
  //         (error) => this.handleError(error)
  //       );
  //     }
  //   });
  // }

  /**
   * Method to open the page edit user
   * @param user User is the object that We must send to the page edit user
   */
  // public goToEditUser(user) {
  //   const dialogEditRef = this.dialog.open(EditUsersComponent,{
  //     data: user
  //   });
  //   dialogEditRef.afterClosed().subscribe(result => {
  //     result && this.getUsers();
  //   });
  // }
}
