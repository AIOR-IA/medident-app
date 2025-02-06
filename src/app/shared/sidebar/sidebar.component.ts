import { Component } from '@angular/core';

interface SidebarItem {
  title: string;
  icon: string;
  path: string;
}

@Component({
  selector: 'sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
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
}
