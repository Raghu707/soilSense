import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

import {
  login,
  forgotPassword
} from '../services/api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  email = '';
  password = '';

  loading = false;

  showPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;

  showForgotPassword = false;

  forgotUsername = '';
  forgotEmail = '';

  newPassword = '';
  confirmPassword = '';

  constructor(
    private router: Router
  ) {}

  ngOnInit(): void {

    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    if (token && role) {

      if (role === 'admin') {

        this.router.navigate([
          '/admin/sensors'
        ]);

      } else {

        this.router.navigate([
          '/student/dashboard'
        ]);

      }
    }
  }

  togglePassword(): void {

    this.showPassword =
      !this.showPassword;

  }

  onLogin(): void {

    if (
      !this.email.trim() ||
      !this.password.trim()
    ) {

      Swal.fire({

        icon: 'warning',

        title: 'Missing Information',

        text: 'Please enter username and password.',

        confirmButtonColor: '#f59e0b'

      });

      return;
    }

    this.loading = true;

    login({
      email: this.email,
      password: this.password
    })

    .then((res: any) => {

      this.loading = false;

      const token =
        res.data.token;

      const user =
        res.data.user;

      localStorage.setItem(
        'token',
        token
      );

      localStorage.setItem(
        'role',
        user.role
      );

      localStorage.setItem(
        'name',
        user.name
      );

      if (user.role === 'admin') {

        this.router.navigate([
          '/admin/sensors'
        ]);

      } else {

        this.router.navigate([
          '/student/dashboard'
        ]);

      }

    })

    .catch((err: any) => {

      console.error(err);

      this.loading = false;

      Swal.fire({

        icon: 'error',

        title: 'Login Failed',

        text: 'Invalid username or password.',

        confirmButtonColor: '#ef4444'

      });

    });

  }

  openForgotPassword(): void {

    this.showForgotPassword = true;

  }

  closeForgotPassword(): void {

    this.showForgotPassword = false;

    this.forgotUsername = '';
    this.forgotEmail = '';

    this.newPassword = '';
    this.confirmPassword = '';

  }

  resetPassword(): void {

    if (!this.forgotUsername.trim()) {

      Swal.fire({

        icon: 'warning',

        title: 'Username Required',

        text: 'Please enter username.',

        confirmButtonColor: '#f59e0b'

      });

      return;

    }

    if (!this.forgotEmail.trim()) {

      Swal.fire({

        icon: 'warning',

        title: 'Email Required',

        text: 'Please enter email.',

        confirmButtonColor: '#f59e0b'

      });

      return;

    }

    if (!this.newPassword.trim()) {

      Swal.fire({

        icon: 'warning',

        title: 'Password Required',

        text: 'Please enter a new password.',

        confirmButtonColor: '#f59e0b'

      });

      return;

    }

    if (
      this.newPassword !==
      this.confirmPassword
    ) {

      Swal.fire({

        icon: 'warning',

        title: 'Passwords Do Not Match',

        text: 'Please make sure both passwords are the same.',

        confirmButtonColor: '#f59e0b'

      });

      return;

    }

    forgotPassword({

      username: this.forgotUsername,

      email: this.forgotEmail,

      newPassword: this.newPassword,

      confirmPassword: this.confirmPassword

    })

    .then((res: any) => {

      Swal.fire({

        icon: 'success',

        title: 'Password Updated',

        text: res.data.message,

        confirmButtonColor: '#22c55e'

      });

      this.closeForgotPassword();

    })

    .catch((err: any) => {

      console.error(err);

      Swal.fire({

        icon: 'error',

        title: 'Reset Failed',

        text:
          err?.response?.data?.msg ||
          err?.response?.data?.message ||
          'Password reset failed',

        confirmButtonColor: '#ef4444'

      });

    });

  }

}