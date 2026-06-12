import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { login } from '../services/api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  email: string = '';
  password: string = '';

  constructor(private router: Router) {}

  ngOnInit(): void {
    // ✅ Auto-login if token exists
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (token && role) {
      if (role === "admin") {
        this.router.navigate(['/admin-dashboard']);
      } else {
        this.router.navigate(['/student-dashboard']);
      }
    }
  }

  onLogin() {
    // ✅ Simple validation
    if (!this.email || !this.password) {
      alert("Please enter email and password");
      return;
    }

    login({
      email: this.email,
      password: this.password
    })
    .then(res => {

      const token = res.data.token;
      const user = res.data.user;

      // ✅ Store in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("role", user.role);
      localStorage.setItem("name", user.name);

      // ✅ Role-based redirect
      if (user.role === 'admin') {
  this.router.navigate(['/admin/sensors']); 
} else {
  this.router.navigate(['/student/dashboard']);
}


    })
    .catch(err => {
      console.error(err);
      alert("Invalid email or password");
    });
  }
}
``