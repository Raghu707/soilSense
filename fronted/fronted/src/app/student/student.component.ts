import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';

import {
  getStudents,
  registerUser,
  deleteUser
} from '../services/api.service';

@Component({
  selector: 'app-admin-students',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.css']
})
export class StudentComponent implements OnInit {

  students: any[] = [];

  showModal = false;

  newStudent: any = {
    name: '',
    email: '',
    password: '',
    role: 'student'
  };

  ngOnInit() {

    this.loadStudents();

  }

  /* LOAD STUDENTS */

  loadStudents() {

    getStudents()
      .then((res: any) => {

        this.students = res.data;

      })
      .catch((err: any) => {

        console.error(
          'Error loading students:',
          err
        );

      });

  }

  /* MODAL */

  openModal() {

    this.showModal = true;

  }

  closeModal() {

    this.showModal = false;

  }

  /* CREATE SUPERVISOR */

  createStudent() {

    if (
      !this.newStudent.name ||
      !this.newStudent.email ||
      !this.newStudent.password
    ) {

      Swal.fire({

        icon: 'warning',

        title: 'All Fields Required',

        text: 'Please fill all fields.',

        confirmButtonColor: '#f59e0b'

      });

      return;

    }

    registerUser(this.newStudent)

      .then(() => {

        this.loadStudents();

        this.closeModal();

        this.newStudent = {
          name: '',
          email: '',
          password: '',
          role: 'student'
        };

        Swal.fire({

          icon: 'success',

          title: 'Supervisor Created',

          text: 'Supervisor account created successfully.',

          confirmButtonColor: '#22c55e'

        });

      })

      .catch((err: any) => {

        console.error(
          'Create error:',
          err
        );

        Swal.fire({

          icon: 'error',

          title: 'Creation Failed',

          text:
            err?.response?.data?.msg ||
            'Failed to create supervisor.',

          confirmButtonColor: '#ef4444'

        });

      });

  }

  /* DELETE SUPERVISOR */

  deleteStudent(id: string) {

    Swal.fire({

      title: 'Delete Supervisor?',

      text: 'This action cannot be undone.',

      icon: 'warning',

      showCancelButton: true,

      confirmButtonText: 'Delete',

      cancelButtonText: 'Cancel',

      confirmButtonColor: '#ef4444',

      cancelButtonColor: '#6b7280'

    }).then((result) => {

      if (result.isConfirmed) {

        deleteUser(id)

          .then(() => {

            this.loadStudents();

            Swal.fire({

              icon: 'success',

              title: 'Deleted Successfully',

              text: 'Supervisor removed successfully.',

              confirmButtonColor: '#22c55e'

            });

          })

          .catch((err: any) => {

            console.error(
              'Delete error:',
              err
            );

            Swal.fire({

              icon: 'error',

              title: 'Delete Failed',

              text: 'Failed to delete supervisor.',

              confirmButtonColor: '#ef4444'

            });

          });

      }

    });

  }

}