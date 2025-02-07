import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListProductsComponent } from './list-products/list-products.component';
import { LayoutComponent } from './layout/layout.component';

const routes: Routes = [
     {
        path: '', component: LayoutComponent, children: [
          {
            path: '',
            component: ListProductsComponent,
          },

        ]
      },

]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ProductRoutingModule { }
