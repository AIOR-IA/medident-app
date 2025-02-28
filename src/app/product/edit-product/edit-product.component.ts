import { Component, Inject, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../services/product.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { shortenBlankSpaces, ValidationAmount } from 'src/app/shared/utils/validation.utils';
import { Product } from '../interfaces/product.interface';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.scss']
})
export class EditProductComponent {
  public productForm: FormGroup;


  public hasAccount: boolean = false;
  public changePasswordFields: boolean = false;

  private fb = inject(FormBuilder);;
  private productService = inject(ProductService);
  private snakBar = inject(MatSnackBar);
  public dialogRef = inject(MatDialogRef<EditProductComponent>);

  constructor(
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public product: Product
  ) { }

  ngOnInit(): void {
    this.productForm = this.fb.group({
      name: ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(60),
      ]],
      price: [0, [
        Validators.required,
        Validators.pattern(ValidationAmount),
      ]],
    },
    );

    this.setCurrentProductValues();
  }

  public setCurrentProductValues(): void {
    this.productForm.patchValue({
      name: this.product.name,
      price: this.product.price,
    });
  }

  /**
   * This method is to create a new User.
   */
  public updateProduct() {
    if (this.productForm.valid) {
      this.trimValues();
      this.shortenBlankSpaces();
      const name = this.productForm.get('name')!.value as string;
      const price = this.productForm.get('price')!.value as number;
      const idDoc = this.product.idDoc;
      this.productService.updateProduct({ name, price, idDoc })
        .then((data) => {
          this.reset();
          this.openSnakBar('Servicio actualizado', 'Aceptar');
          this.dialogRef.close(data);
        })
        .catch((error) => {
          this.openSnakBar('Error, no se pudo actualizar el servicio', 'Aceptar');
        });
    }
    else {
      this.productForm.markAllAsTouched();
      return;
    }
  }

  /**
   * Method for showing a custom message.
   * @param message The message to display in the snack bar.
   * @param action The label for the action button in the snack bar.
   */
  openSnakBar(message: string, action: string): void {
    this.snakBar.open(message, action, { duration: 3000 });
  }

  /**
   * Trims whitespace from the beginning and end of form inputs.
   */
  private trimValues(): void {
    this.productForm.patchValue({
      name: this.productForm.get('name')!.value.trim(),
    })
  }

  /**
   * Replaces consecutive blank spaces with a single space.
   */
  private shortenBlankSpaces(): void {
    this.productForm.patchValue({
      name: shortenBlankSpaces(this.productForm.get('name')!.value),
    })
  }



  /**
   * Method for get the name.
   */
  public get name() {
    return this.productForm.get('name');
  }

  /**
   * Method for get the price.
   */
  public get price() {
    return this.productForm.get('price');
  }

  reset() {
    this.productForm.reset();
  }
}
