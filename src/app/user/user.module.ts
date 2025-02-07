import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListUsersComponent } from './list-users/list-users.component';
import { UserRoutingModule } from './user-routing.module';
import { RouterModule } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { MaterialModule } from '../material/material.module';



@NgModule({
  declarations: [
    ListUsersComponent,
    LayoutComponent,
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    RouterModule,
    MaterialModule
  ]
})
export class UserModule { }
