import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']  ,
})
export class AdminDashboardComponent {

  name = '';

  constructor(private router: Router) {
    this.name = localStorage.getItem("name") || "Admin";
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/']);
  }
}