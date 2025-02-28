import { Component, ElementRef, EventEmitter, inject, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { debounceTime, Subject, Subscription } from 'rxjs';
import { User } from 'src/app/user/interfaces/user.interface';
import { UserService } from 'src/app/user/services/user.service';

@Component({
  selector: 'list-calendar-user',
  templateUrl: './list-calendar-user.component.html',
  styleUrls: ['./list-calendar-user.component.scss']
})
export class ListCalendarUserComponent {

  @Output() selectedUser = new EventEmitter<User>();

  private listObs$: Subscription = new Subscription();
  @ViewChild('txtInput') txtInput: ElementRef<HTMLInputElement>;
  public debouncer: Subject<string> = new Subject();

  tableColumns: string[] = ['userFullName', 'userEmail', 'userCi', 'userColor', 'userActions'];
  public users = new MatTableDataSource<User>();

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
      .subscribe(search => {
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

  addUser(user: User) {
    this.selectedUser.emit(user);
  }

  filterBy(search: string) {
    const name = search.trim().toLowerCase();
    this.debouncer.next(name);
  }

  clearFilter() {
    if (this.txtInput.nativeElement.value.length > 0) {
      this.txtInput.nativeElement.value = '';
      this.getUsers();
    }
  }
}
