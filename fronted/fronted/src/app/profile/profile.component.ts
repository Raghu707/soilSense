import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import Swal from 'sweetalert2';

import {
  forgotPassword
} from '../services/api.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

 // API_URL = 'http://localhost:5000/api';
 API_URL = 'https://soilsense-1-zp8c.onrender.com/api';
  name = '';
  email = '';
  role = '';

  project = 'Not Assigned';
  sensor = 'Not Assigned';
  supervisor = 'Not Assigned';

  observationCount = 0;

  showEditModal = false;
  showPasswordModal = false;

  editUsername = '';
  editEmail = '';

  newPassword = '';
  confirmPassword = '';

  constructor(
    private http: HttpClient
  ) {}

  ngOnInit(): void {

    this.role =
      localStorage.getItem('role') || 'student';

    this.loadProfile();

  }

  loadProfile(): void {

    const token =
      localStorage.getItem('token');

    const headers =
      new HttpHeaders({
        Authorization: `Bearer ${token}`
      });

    this.http.get<any>(
      `${this.API_URL}/students/profile`,
      { headers }
    )
    .subscribe({

      next: (res) => {

        this.name =
          res.username || '';

        this.email =
          res.email || '';

        this.project =
          res.project || 'Not Assigned';

        this.sensor =
          res.sensor || 'Not Assigned';

        this.supervisor =
          res.supervisor || 'Not Assigned';

        this.observationCount =
          res.observationCount || 0;

      },

      error: (err) => {

        console.error(err);

        Swal.fire({

          icon: 'error',

          title: 'Profile Load Failed',

          text: 'Unable to load profile information.',

          confirmButtonColor: '#ef4444'

        });

      }

    });

  }

  logout(): void {

    localStorage.clear();

    location.href = '/login';

  }

  /* =====================
     EDIT PROFILE
  ===================== */

  openEditModal(): void {

    this.editUsername = this.name;
    this.editEmail = this.email;

    this.showEditModal = true;

  }

  closeEditModal(): void {

    this.showEditModal = false;

  }

  saveProfile(): void {

    const token =
      localStorage.getItem('token');

    const headers =
      new HttpHeaders({
        Authorization: `Bearer ${token}`
      });

    this.http.put<any>(
      `${this.API_URL}/students/profile`,
      {
        username: this.editUsername,
        email: this.editEmail
      },
      { headers }
    )
    .subscribe({

      next: () => {

        this.showEditModal = false;

        localStorage.setItem(
          'name',
          this.editUsername
        );

        this.loadProfile();

        Swal.fire({

          icon: 'success',

          title: 'Profile Updated',

          text: 'Profile information updated successfully.',

          confirmButtonColor: '#22c55e'

        });

      },

      error: (err) => {

        console.error(err);

        Swal.fire({

          icon: 'error',

          title: 'Update Failed',

          text: 'Unable to update profile.',

          confirmButtonColor: '#ef4444'

        });

      }

    });

  }

  /* =====================
     CHANGE PASSWORD
  ===================== */

  openPasswordModal(): void {

    this.newPassword = '';
    this.confirmPassword = '';

    this.showPasswordModal = true;

  }

  closePasswordModal(): void {

    this.showPasswordModal = false;

    this.newPassword = '';
    this.confirmPassword = '';

  }

  changePassword(): void {

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

      username: this.name,

      email: this.email,

      newPassword: this.newPassword,

      confirmPassword: this.confirmPassword

    })

    .then((res: any) => {

      this.closePasswordModal();

      Swal.fire({

        icon: 'success',

        title: 'Password Updated',

        text:
          res.data.message ||
          'Password updated successfully.',

        confirmButtonColor: '#22c55e'

      });

    })

    .catch((err: any) => {

      console.error(err);

      Swal.fire({

        icon: 'error',

        title: 'Update Failed',

        text:
          err?.response?.data?.msg ||
          err?.response?.data?.message ||
          'Password update failed.',

        confirmButtonColor: '#ef4444'

      });

    });

  }

}