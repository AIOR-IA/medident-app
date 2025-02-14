import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListProductsComponent } from './list-products/list-products.component';
import { LayoutComponent } from './layout/layout.component';
import { ProductRoutingModule } from './product-routing.module';
import { CreateProductComponent } from './create-product/create-product.component';
import { EditProductComponent } from './edit-product/edit-product.component';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../material/material.module';
import { CoreModule } from '../core/core.module';



@NgModule({
  declarations: [
    ListProductsComponent,
    LayoutComponent,
    CreateProductComponent,
    EditProductComponent
  ],
  imports: [
    CommonModule,
    ProductRoutingModule,
    RouterModule,
    MaterialModule,
    CoreModule,
  ]
})
export class ProductModule { }
