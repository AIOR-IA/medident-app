import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListUsersComponent } from './list-users/list-users.component';
import { UserRoutingModule } from './user-routing.module';
import { RouterModule } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { MaterialModule } from '../material/material.module';
import { CreateUserComponent } from './create-user/create-user.component';
import { CoreModule } from '../core/core.module';
import { EditUserComponent } from './edit-user/edit-user.component';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    ListUsersComponent,
    LayoutComponent,
    CreateUserComponent,
    EditUserComponent,
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    RouterModule,
    MaterialModule,
    CoreModule,
  ]
})
export class UserModule { }
