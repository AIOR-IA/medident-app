import { AfterViewInit, Component, ElementRef, Inject, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ProductResponse } from 'src/app/calendar/interfaces/product-response.interface';
import { Patient } from '../interfaces/patient.interface';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PatientService } from '../services/patient.service';
import { debounceTime, Subject, Subscription } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { Product } from 'src/app/product/interfaces/product.interface';
import { ProductService } from '../../product/services/product.service';
import { MatPaginator } from '@angular/material/paginator';
import { DocumentData, QueryDocumentSnapshot } from '@firebase/firestore';
import { Treatment } from '../interfaces/treatment.interface';
@Component({
  selector: 'app-create-budget',
  templateUrl: './create-budget.component.html',
  styleUrls: ['./create-budget.component.scss']
})
export class CreateBudgetComponent implements OnInit, OnDestroy, AfterViewInit {

  public finalBudget: number = 0;

  // form patient
  public patientForm: FormGroup;


  public hasAccount: boolean = false;
  public changePasswordFields: boolean = false;

  private fb = inject(FormBuilder);;
  private patientService = inject(PatientService);
  private snakBar = inject(MatSnackBar);
  public dialogRef = inject(MatDialogRef<CreateBudgetComponent>);


  // table selected products
  displayedColumns: string[] = ['position', 'name', 'price', 'quantity', 'total', 'actions'];
  dataSource: MatTableDataSource<ProductResponse> = new MatTableDataSource<ProductResponse>();

  // list of products
  public selectedProduct: ProductResponse[] = [];
  @ViewChild('txtInput') txtInput: ElementRef<HTMLInputElement>;
  public debouncer: Subject<string> = new Subject();
  private listObs$: Subscription = new Subscription();
  tableColumns: string[] = ['productName', 'productPrice', 'productQuantity', 'productActions'];
  public products = new MatTableDataSource<Product>();


  totalProducts: number = 0;
  public pageSize: number = 0;
  lastDocs: QueryDocumentSnapshot<DocumentData>[] = [];
  public pageIndex: number = 0;
  private searchName: string = '';
  private productService = inject(ProductService);
  @ViewChild(MatPaginator) paginator: MatPaginator;


  constructor(
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public patient: Patient
  ) { }

  ngOnInit(): void {
    this.patientForm = this.fb.group({
      firstName: ['', []],
      ci: ['', []],
    },
    );

    this.setCurrentPatientValues();

    this.getProducts();

    this.debouncer
      .pipe(
        debounceTime(800)
      )
      .subscribe(search => {
        this.getProducts(search);
      })
    this.pageSize = 3;
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

  public setCurrentPatientValues(): void {
    this.patientForm.patchValue({
      firstName: `${this.patient.firstName} ${this.patient.lastName}`,
      ci: this.patient.ci,
    });
  }

  public getProducts(name = '') {
    this.listObs$.unsubscribe();
    this.listObs$ = new Subscription()

    this.pageSize = 3;
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
              this.openSnakBar('Error, no se pudo obtener el total de productos', 'Aceptar');
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

  addProduct(product: ProductResponse) {
    const currentProduct: ProductResponse = {
      ...product,
      quantity: product.quantity,
      done: 0
    }
    if (product.quantity < 1 || product.quantity === undefined) {
      this.openSnakBar('Error no se puede agregar el producto porque la cantidad debe ser mayor o igual a 1', 'Aceptar');
    } else {
      this.selectedProduct.push(currentProduct);
      this.dataSource.data = this.selectedProduct;
      this.finalBudget += currentProduct.price * currentProduct.quantity;
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
      this.searchName = '';
      this.updatePaginator();
    }
  }

  updatePaginator() {
    this.pageIndex = 0;
    this.pageSize = 3;
    this.lastDocs = [];
    this.searchName = '';
    this.products.paginator.length = this.totalProducts;
    this.getProducts();
  }

  deleteSelectedProduct(product: ProductResponse) {
    this.selectedProduct = this.selectedProduct.filter(productSelected => productSelected.idDoc !== product.idDoc);
    this.dataSource.data = this.selectedProduct;
    this.finalBudget -= product.price * product.quantity;
  }
  /**
   * Method for showing a custom message.
   * @param message The message to display in the snack bar.
   * @param action The label for the action button in the snack bar.
   */
  openSnakBar(message: string, action: string): void {
    this.snakBar.open(message, action, { duration: 3000 });
  }

  createTreatment() {
    const treatment: Treatment = {
      idPatient: this.patient.idDoc!,
      products: this.selectedProduct,
      budget: this.finalBudget,
      debt: this.finalBudget,
      status: 'review'
    }
    this.patientService.createTreatment(treatment).then(() => {
      this.openSnakBar('Tratamiento creado exitosamente', 'Aceptar');
      this.dialogRef.close();
    }).catch((error) => {
      this.openSnakBar('Error al crear el tratamiento', 'Aceptar');
    });
  }

  cleanValues() {
    this.selectedProduct = [];
    this.dataSource.data = [];
    this.finalBudget = 0;
    this.searchName = '';
    this.updatePaginator();
    this.getProducts(this.searchName);
  }
}
