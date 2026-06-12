import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {

  name: string = '';
  role: string = '';

  menu: any[] = [];

  isSidebarOpen = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.name = localStorage.getItem('name') || 'User';
    this.role = localStorage.getItem('role') || 'student';

    this.setMenu();
  }

  setMenu() {
    if (this.role === 'admin') {
      this.menu = [
        { label: 'Sensors', route: '/admin/sensors' },
        { label: 'Projects', route: '/admin/projects' },
        { label: 'Students', route: '/admin/students' }
      ];
    } else {
      this.menu = [
        { label: 'Dashboard', route: '/student/dashboard' },
        { label: 'Observations', route: '/student/observations' }
      ];
    }
  }

  goToProfile() {
    if (this.role === 'admin') {
      this.router.navigate(['/admin/profile']);
    } else {
      this.router.navigate(['/student/profile']);
    }
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  closeSidebar() {
    this.isSidebarOpen = false;
  }

}