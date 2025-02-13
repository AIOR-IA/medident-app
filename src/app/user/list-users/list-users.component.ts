import { Component, ElementRef, inject, OnDestroy, ViewChild, ViewRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { User, RoleUser } from '../interfaces/user.interface';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { CreateUserComponent } from '../create-user/create-user.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { UserService } from '../services/user.service';
import { ClassButtonType } from 'src/app/shared/enums/class.button.type.enum';
import { ConfirmDialogComponent } from 'src/app/core/confirm-dialog/confirm-dialog.component';
import { EditUserComponent } from '../edit-user/edit-user.component';
import { debounceTime, Subject, Subscription } from 'rxjs';

@Component({
  selector: 'list-users',
  templateUrl: './list-users.component.html',
  styleUrls: ['./list-users.component.scss']
})
export class ListUsersComponent implements OnDestroy {

  private listObs$: Subscription = new Subscription();
  @ViewChild('txtInput') txtInput: ElementRef<HTMLInputElement>;
  public debouncer:Subject<string> = new Subject();

  tableColumns: string[] = ['userFullName', 'userEmail', 'userPhoneNumer', 'userTotalEvents', 'userColor', 'userRole', 'userStatus', 'userActions'];
  public users = new MatTableDataSource<User>();
  public RoleType: RoleUser;

  public orderFullName: string = 'DESC';

  public pageSize: number = 0;
  public pageLength: number = 0;
  public pageIndex: number = 0;
  public size: any;

  isLoading = false;
  lastDocument: User | null = null;

  public statuses = {
    fullName: false,
    email: false,
    phoneNumber: false,
    totalEvents: false,
    color: false,
    role: false,
    isActive: false,

  };

  private snakBar = inject(MatSnackBar);
  public dialog = inject(MatDialog);
  private userService = inject(UserService);

  constructor(
  ) { }

  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngOnInit(): void {
    this.getUsers();

    this.debouncer
    .pipe(
      debounceTime(800)
    )
    .subscribe( search => {
      this.getUsers(search);
    })
    // this.loadFirstPage();
    this.pageSize = 10;
  }

  ngOnDestroy(): void {
    this.debouncer.unsubscribe();
    this.listObs$.unsubscribe();
  }

  loadFirstPage() {
    this.isLoading = true;
    // this.userService.getFirstPage().subscribe(users => {
    //   console.log(users);
    //   this.users.data = users;
    //   this.lastDocument = users[users.length - 1];
    //   this.isLoading = false;
    // });
  }

  loadNextPage() {
    if (this.lastDocument) {
      this.isLoading = true;
      // this.userService.getNextPage(this.lastDocument).subscribe(users => {
      //   this.users.data = [...this.users.data, ...users];
      //   this.lastDocument = users[users.length - 1];
      //   this.isLoading = false;
      // });
    }
  }

  ngAfterViewInit(): void {
    this.users.paginator = this.paginator;
  }



  /**
   * Method to get all the users
   */
  public getUsers(name = '') {
    this.listObs$.unsubscribe();
    this.listObs$ = new Subscription()

    this.size = this.pageSize;
    this.pageSize = 0;
    const usersObs$ = this.userService.getAllUsersObs(name).subscribe(users => {
      this.users.data = users;
      this.pageLength = users.length;
    });
    this.pageSize = this.size;
    this.listObs$.add(usersObs$);
  }

  /**
   * Method to open the page create user
   */
  public goToCreateUser() {
    const dialogCreateRef = this.dialog.open(CreateUserComponent);
    dialogCreateRef.afterClosed().subscribe(result => {
      result && this.getUsers();
    });

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
    this.snakBar.open(message, action, { duration: 3000 });
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
    * Updates the status of a user and opens a confirmation dialog modal.
    * @param user The user to update the status for.
   */
  public updateStatus(user: User) {
    const message = user.isActive === true ? `¿Deseas cambiar el estado a INACTIVO al usuario ${user.firstName}?` : `¿Deseas cambiar el estado a ACTIVO al usuario ${user.firstName}?`;
    const confirm = user.isActive === true ? 'Deshabilitar' : 'Habilitar';
    const statusChange = user.isActive === true ? false : true;
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '430px',
      data: {
        title: 'Actualizar Estado ',
        description: message,
        btnCancel: { text: 'Cancelar', class: ClassButtonType.Black },
        btnConfirm: { text: confirm, class: ClassButtonType.Delete },
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.userService.updateStatusUser(user.idDoc, statusChange)
          .then((data) => {
            this.openSnakBar('Usuario actualizado correctamente', 'Aceptar');
            // this.getUsers();
          })
          .catch(error => {
            (error) => this.handleError(error)
          })
      }
    });
  }

  /**
   * Method to open the page edit user
   * @param user User is the object that We must send to the page edit user
   */
  public goToEditUser(user) {
    const dialogEditRef = this.dialog.open(EditUserComponent, {
      data: user
    });
    dialogEditRef.afterClosed().subscribe(result => {
      result && this.getUsers();
    });
  };

  filterBy(search: string) {
    const name = search.trim().toLowerCase();
    this.debouncer.next(name);
  }

  clearFilter() {
    if(this.txtInput.nativeElement.value.length > 0 ) {
      this.txtInput.nativeElement.value = '';
      this.getUsers();
    }
  }
}
