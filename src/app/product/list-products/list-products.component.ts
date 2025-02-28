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
import { DocumentData, QueryDocumentSnapshot } from '@firebase/firestore';
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

  totalProducts: number = 0;
  public pageSize: number = 0;
  lastDocs: QueryDocumentSnapshot<DocumentData>[] = [];
  public pageIndex: number = 0;
  private searchName: string = '';

  private snakBar = inject(MatSnackBar);
  public dialog = inject(MatDialog);
  private productService = inject(ProductService);

  constructor() { }

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {
    this.getProducts();

    this.debouncer
      .pipe(
        debounceTime(400)
      )
      .subscribe(search => {
        this.pageIndex = 0;
        this.searchName = search;
        this.getProducts(this.searchName);
      })


    this.pageSize = 10;
  }

  ngOnDestroy(): void {
    this.debouncer.unsubscribe();
    this.listObs$.unsubscribe();
  }

  ngAfterViewInit(): void {
    this.productService.totalProducts$.subscribe((total) => {
      this.totalProducts = total;
      setTimeout(() => {
        this.products.paginator.length = this.totalProducts;
      }, 200);
    });
    // Agregar una acción personalizada al botón Next
    this.paginator.nextPage = () => {
      if ((this.pageIndex + 1) * this.pageSize < this.totalProducts) {
        this.pageIndex++;
        this.getProducts(this.searchName);
        setTimeout(() => {
          this.products.paginator.length = this.totalProducts;
          this.products.paginator.pageIndex = this.pageIndex;
          this.paginator.pageIndex = this.pageIndex;
        }, 400);
      }
    };

    // Agregar una acción personalizada al botón Previous
    this.paginator.previousPage = () => {
      if (this.pageIndex > 0) {
        this.pageIndex--;
        this.getProducts(this.searchName);

        setTimeout(() => {
          this.products.paginator.length = this.totalProducts;
          this.products.paginator.pageIndex = this.pageIndex;
          this.paginator.pageIndex = this.pageIndex;
        }, 400);
      }
    };

    this.products.paginator = this.paginator;
  }

  /**
   * Method to get all the patients
   */
  public getProducts(name = '') {
    this.listObs$.unsubscribe();
    this.listObs$ = new Subscription()

    this.pageSize = 10;
    const patientsObs$ = this.productService.getAllProductsObs(this.pageIndex, this.pageSize, this.lastDocs[this.pageIndex - 1] || undefined, name).subscribe(result => {
      this.products.data = result.products;
      this.lastDocs[this.pageIndex] = result.lastDoc!; // Store last document
      setTimeout(() => {
        if (name !== '') {
          this.productService.countProductsByPrefix(name)
            .then((total) => {
              this.products.paginator.length = total;
              this.paginator.length = total;
            })
            .catch((error) => {
              this.openSnakBar('Error, no se pudo obtener el total de servicios', 'Aceptar');
            });
        } else {
          this.products.paginator.length = this.totalProducts;
          this.paginator.length = this.totalProducts;
        }
        this.paginator.pageIndex = this.pageIndex;
      }, 400);
      // this.pageLength = patients.length;
    });
    this.listObs$.add(patientsObs$);
  }

  /**
   * Method to open the page create Patient
   */
  public goToCreatePatient() {
    const dialogCreateRef = this.dialog.open(CreateProductComponent);
    dialogCreateRef.afterClosed().subscribe(result => {
      if (result) {
        this.updatePaginator();
      }
    });
  }

  updatePaginator() {
    this.pageIndex = 0;
    this.pageSize = 10;
    this.lastDocs = [];
    this.searchName = '';
    this.products.paginator.length = this.totalProducts;
    this.getProducts();
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
      if (result) {
        this.updatePaginator();
      }
    });
  };

  filterBy(search: string) {
    const name = search.trim().toLowerCase();
    this.debouncer.next(name);
  }

  clearFilter() {
    if (this.txtInput.nativeElement.value.length > 0) {
      this.txtInput.nativeElement.value = '';
      this.searchName = '';
      this.updatePaginator();
    }
  }


}
