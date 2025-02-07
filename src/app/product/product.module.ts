import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListProductsComponent } from './list-products/list-products.component';
import { LayoutComponent } from './layout/layout.component';
import { ProductRoutingModule } from './product-routing.module';



@NgModule({
  declarations: [
    ListProductsComponent,
    LayoutComponent
  ],
  imports: [
    CommonModule,
    ProductRoutingModule,
  ]
})
export class ProductModule { }
