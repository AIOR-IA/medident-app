import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';

interface SidebarItem {
  title: string;
  icon: string;
  path: string;
}

@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit{
  currentUser : string;
  paths: SidebarItem[] = [
    {
      path: '/calendar',
      title: 'Calendario',
      icon: 'calendar_month'
    },
    {
      path: '/patient',
      title: 'Pacientes',
      icon: 'person'
    },
    {
      path: '/product',
      title: 'Productos',
      icon: 'inventory_2'
    },
    {
      path: '/user',
      title: 'Usuarios',
      icon: 'person'
    }
  ]

  private authService = inject(AuthService);
  private router = inject(Router);

  ngOnInit(): void {
    this.authService.currentUser().then( user => this.currentUser = user.uid).catch( error => console.log(error));
  }

  get isAuth() {
    return this.authService.isAuth();
  }

  logout() {
    this.authService.logout();
    this.router.navigateByUrl("/login")
  }
}
