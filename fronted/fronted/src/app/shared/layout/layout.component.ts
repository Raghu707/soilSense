import { Component, OnInit } from '@angular/core';
import {
  Router,
  NavigationEnd
} from '@angular/router';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {

  name: string = '';
  role: string = '';

  pageTitle = '🌱 SoilSense Dashboard';

  dropdownOpen = false;

  isSidebarOpen = false;

  menu: any[] = [];

  constructor(
    private router: Router
  ) {

    this.router.events.subscribe(event => {

      if (event instanceof NavigationEnd) {

        const url = event.urlAfterRedirects;

        if (url.includes('sensors')) {

          this.pageTitle =
            '📡 Sensor Management';

        }
        else if (url.includes('projects')) {

          this.pageTitle =
            '📁 Project Management';

        }
        else if (url.includes('students')) {

          this.pageTitle =
            '👨‍🎓 Student Management';

        }
        else if (url.includes('profile')) {

          this.pageTitle =
            '👤 User Profile';

        }
        else if (url.includes('dashboard')) {

          this.pageTitle =
            '📊 Dashboard';

        }
        else if (url.includes('observations')) {

          this.pageTitle =
            '📝 Observations';

        }
        else {

          this.pageTitle =
            '🌱 SoilSense Dashboard';

        }
      }
    });
  }

  ngOnInit(): void {

    this.name =
      localStorage.getItem('name') || 'User';

    this.role =
      localStorage.getItem('role') || 'student';

    this.setMenu();
  }

  setMenu(): void {

    if (this.role === 'admin') {

      this.menu = [

        {
          label: 'Sensors',
          route: '/admin/sensors'
        },

        {
          label: 'Projects',
          route: '/admin/projects'
        },

        {
          label: 'Students',
          route: '/admin/students'
        }

      ];

    } else {

      this.menu = [

        {
          label: 'Dashboard',
          route: '/student/dashboard'
        },

        {
          label: 'Observations',
          route: '/student/observations'
        }

      ];
    }
  }

  toggleDropdown(): void {

    this.dropdownOpen =
      !this.dropdownOpen;
  }

  goToProfile(): void {

    this.dropdownOpen = false;

    if (this.role === 'admin') {

      this.router.navigate([
        '/admin/profile'
      ]);

    } else {

      this.router.navigate([
        '/student/profile'
      ]);

    }
  }

  logout(): void {

    localStorage.clear();

    this.router.navigate([
      '/login'
    ]);
  }

  toggleSidebar(): void {

    this.isSidebarOpen =
      !this.isSidebarOpen;
  }

  closeSidebar(): void {

    this.isSidebarOpen = false;
  }
}