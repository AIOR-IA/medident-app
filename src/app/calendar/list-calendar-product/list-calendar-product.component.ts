import { Component, ElementRef, EventEmitter, inject, Output, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { debounceTime, Subject, Subscription } from 'rxjs';
import { Product } from 'src/app/product/interfaces/product.interface';
import { ProductService } from 'src/app/product/services/product.service';
import { ProductResponse } from '../interfaces/product-response.interface';

@Component({
  selector: 'list-calendar-product',
  templateUrl: './list-calendar-product.component.html',
  styleUrls: ['./list-calendar-product.component.scss']
})
export class ListCalendarProductComponent {
 @Output() selectedProduct = new EventEmitter<ProductResponse>();

  @ViewChild('txtInput') txtInput: ElementRef<HTMLInputElement>;
  public debouncer: Subject<string> = new Subject();
  private listObs$: Subscription = new Subscription();
  tableColumns: string[] = ['productName', 'productPrice', 'productQuantity', 'productActions'];
  public products = new MatTableDataSource<Product>();


  public pageSize: number = 0;
  public pageLength: number = 0;
  public pageIndex: number = 0;
  public size: any;

  isLoading = false;
  lastDocument: Product | null = null;

  private snakBar = inject(MatSnackBar);
  private productService = inject(ProductService);

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
    this.pageSize = 5;
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
    // const productsObs$ = this.productService.getAllProductsObs(name).subscribe(products => {
    //   this.products.data = products;
    //   this.pageLength = products.length;
    // });
    this.pageSize = this.size;
    // this.listObs$.add(productsObs$);
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

  addProduct(product: ProductResponse) {
    if( product.quantity < 1 || product.quantity === undefined) {
      this.openSnakBar('Error no se puede agregar el producto porque la cantidad debe ser mayor o igual a 1', 'Aceptar');
    } else {
      this.selectedProduct.emit(product);
      product.quantity = 0;
    }
  }

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
