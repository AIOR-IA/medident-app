import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';
import { User } from 'src/app/user/interfaces/user.interface';

interface SidebarItem {
  title: string;
  icon: string;
  path: string;
  view: string;
}

@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit{
  currentUser: User | null = null;
  paths: SidebarItem[] = [
    {
      path: '/calendar',
      title: 'Calendario',
      icon: 'calendar_month',
      view: '',
    },
    {
      path: '/patient',
      title: 'Pacientes',
      icon: 'person',
      view: ''
    },
    {
      path: '/product',
      title: 'Servicios',
      icon: 'inventory_2',
      view: 'admin'
    },
    {
      path: '/user',
      title: 'Usuarios',
      icon: 'person',
      view: 'admin'
    }
  ]

  private authService = inject(AuthService);
  private router = inject(Router);

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  get isAuth() {
    return this.authService.isAuth();
  }

  logout() {
    this.authService.logout();
    this.router.navigateByUrl("/login")
  }
}
