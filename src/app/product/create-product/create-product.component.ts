import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { shortenBlankSpaces, ValidationAmount } from 'src/app/shared/utils/validation.utils';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-create-product',
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.scss']
})
export class CreateProductComponent {
  public productForm: FormGroup;


  public hasAccount: boolean = false;
  public changePasswordFields: boolean = false;

  private fb = inject(FormBuilder);;
  private productService = inject(ProductService);
  private snakBar = inject(MatSnackBar);
  public dialogRef = inject(MatDialogRef<CreateProductComponent>);

  constructor(

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
  }

  /**
   * This method is to create a new User.
   */
  public saveProduct() {
    if (this.productForm.valid) {
      this.trimValues();
      this.shortenBlankSpaces();
      const name = this.productForm.get('name')!.value as string;
      const price = this.productForm.get('price')!.value as number;

      this.productService.createProduct({ name, price})
        .then((data) => {
          this.reset();
          this.openSnakBar('Producto creado', 'Aceptar');
          this.dialogRef.close(data);
        })
        .catch((error) => {
          this.openSnakBar('Error, no se pudo crear el producto', 'Aceptar');
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
