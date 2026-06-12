import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { register } from '../services/api.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  name = '';
  email = '';
  password = '';
  confirmPassword = '';

  constructor(private router: Router) {}

  onRegister() {

    if (this.password !== this.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    register({
      name: this.name,
      email: this.email,
      password: this.password
    }).then(() => {
      alert("Registered successfully");
      this.router.navigate(['']);
    });
  }
}