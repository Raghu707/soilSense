import { Component } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

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

  acceptedTerms = false;
  showTermsModal = false;

  showPassword = false;
  showConfirmPassword = false;

  loading = false;
  registrationSuccess = false;

  constructor(
    private router: Router
  ) {}

  togglePassword() {

    this.showPassword =
      !this.showPassword;

  }

  toggleConfirmPassword() {

    this.showConfirmPassword =
      !this.showConfirmPassword;

  }

  onTermsCheckboxClick(event: any) {

    if (event.target.checked) {

      this.showTermsModal = true;

    } else {

      this.acceptedTerms = false;

    }

  }

  openTermsModal() {

    this.showTermsModal = true;

  }

  acceptTerms() {

    this.acceptedTerms = true;

    this.showTermsModal = false;

  }

  rejectTerms() {

    this.acceptedTerms = false;

    this.showTermsModal = false;

  }

  onRegister() {

    if (!this.acceptedTerms) {

      Swal.fire({

        icon: 'warning',

        title: 'Terms Required',

        text: 'Please accept Terms & Conditions before continuing.',

        confirmButtonColor: '#f59e0b'

      });

      return;

    }

    if (this.password !== this.confirmPassword) {

      Swal.fire({

        icon: 'warning',

        title: 'Passwords Do Not Match',

        text: 'Please make sure both passwords are the same.',

        confirmButtonColor: '#f59e0b'

      });

      return;

    }

    this.loading = true;

    register({

      name: this.name,

      email: this.email,

      password: this.password

    })

    .then(() => {

      this.loading = false;

      this.registrationSuccess = true;

      Swal.fire({

        icon: 'success',

        title: 'Account Created',

        text: 'Your account has been created successfully.',

        confirmButtonColor: '#22c55e'

      });

      setTimeout(() => {

        this.router.navigate(['/']);

      }, 2500);

    })

    .catch((err) => {

      this.loading = false;

      console.error(
        'Register Error:',
        err
      );

      Swal.fire({

        icon: 'error',

        title: 'Registration Failed',

        text:
          err.response?.data?.msg ||
          err.response?.data?.error ||
          'Registration failed',

        confirmButtonColor: '#ef4444'

      });

    });

  }

}