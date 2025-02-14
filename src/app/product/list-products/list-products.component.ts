import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { debounceTime, Subject, Subscription } from 'rxjs';
import { Product } from '../interfaces/product.interface';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ProductService } from '../services/product.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { CreateProductComponent } from '../create-product/create-product.component';
import { EditProductComponent } from '../edit-product/edit-product.component';

@Component({
  selector: 'list-products',
  templateUrl: './list-products.component.html',
  styleUrls: ['./list-products.component.scss']
})
export class ListProductsComponent {
private listObs$: Subscription = new Subscription();
  @ViewChild('txtInput') txtInput: ElementRef<HTMLInputElement>;
  public debouncer: Subject<string> = new Subject();

  tableColumns: string[] = ['productName', 'productPrice', 'productActions'];
  public products = new MatTableDataSource<Product>();


  public pageSize: number = 0;
  public pageLength: number = 0;
  public pageIndex: number = 0;
  public size: any;

  isLoading = false;
  lastDocument: Product | null = null;

  private snakBar = inject(MatSnackBar);
  public dialog = inject(MatDialog);
  private productService = inject(ProductService);

  constructor(
  ) { }

  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngOnInit(): void {
    this.getProducts();

    this.debouncer
      .pipe(
        debounceTime(800)
      )
      .subscribe(search => {
        this.getProducts(search);
      })
    this.pageSize = 10;
  }

  ngOnDestroy(): void {
    this.debouncer.unsubscribe();
    this.listObs$.unsubscribe();
  }

  ngAfterViewInit(): void {
    this.products.paginator = this.paginator;
  }



  /**
   * Method to get all the patients
   */
  public getProducts(name = '') {
    this.listObs$.unsubscribe();
    this.listObs$ = new Subscription()

    this.size = this.pageSize;
    this.pageSize = 0;
    const patientsObs$ = this.productService.getAllProductsObs(name).subscribe(patients => {
      this.products.data = patients;
      this.pageLength = patients.length;
    });
    this.pageSize = this.size;
    this.listObs$.add(patientsObs$);
  }

  /**
   * Method to open the page create Patient
   */
  public goToCreatePatient() {
    const dialogCreateRef = this.dialog.open(CreateProductComponent);
    dialogCreateRef.afterClosed().subscribe(result => {
      result && this.getProducts();
    });

  }

  /**
   * Method to change the page size of the patient paginator.
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
   * Method to open the page edit patient
   * @param patient Patient is the object that We must send to the page edit patient
   */
  public goToEditPatient(patient) {
    const dialogEditRef = this.dialog.open(EditProductComponent, {
      data: patient
    });
    dialogEditRef.afterClosed().subscribe(result => {
      result && this.getProducts();
    });
  };

  filterBy(search: string) {
    const name = search.trim().toLowerCase();
    this.debouncer.next(name);
  }

  clearFilter() {
    if (this.txtInput.nativeElement.value.length > 0) {
      this.txtInput.nativeElement.value = '';
      this.getProducts();
    }
  }
}
