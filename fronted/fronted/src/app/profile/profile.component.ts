import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  name: string = '';
  email: string = '';
  role: string = '';

  // student-specific
  seminar: string = 'SEM-2026-04';

  // project info
  project = {
    name: 'North field — wheat trial',
    sensor: 'SNS-001',
    supervisor: 'Prof. Zigan',
    start: '15 Mar 2026',
    end: '15 Sep 2026',
    status: 'Active'
  };

  ngOnInit(): void {
    this.name = localStorage.getItem('name') || 'Anna Kowalski';
    this.email = localStorage.getItem('email') || 'a.kowalski@uni.edu';
    this.role = localStorage.getItem('role') || 'student';
  }

  logout() {
    localStorage.clear();
  }

}