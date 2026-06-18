import { Component, OnInit } from '@angular/core';
import { getStudents, registerUser, deleteUser } from '../services/api.service';

@Component({
  selector: 'app-admin-students',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.css']
})
export class StudentComponent implements OnInit {

  students: any[] = [];
  showModal = false;

  // ✅ NEW STUDENT FORM (aligned with backend)
  newStudent: any = {
    name: '',
    email: '',
    password: '',
    role: 'student'
  };

  ngOnInit() {
    this.loadStudents();
  }

  // ✅ LOAD STUDENTS FROM API
  loadStudents() {
    getStudents()
      .then((res: any) => {
        this.students = res.data;
      })
      .catch((err: any) => {
        console.error("Error loading students:", err);
      });
  }

  // ✅ MODAL
  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  // ✅ CREATE STUDENT (REGISTER API)
  createStudent() {

    if (!this.newStudent.name || !this.newStudent.email || !this.newStudent.password) {
      alert("All fields required");
      return;
    }

    registerUser(this.newStudent)
      .then(() => {
        alert("✅ Student created successfully");

        this.loadStudents();
        this.closeModal();

        // reset form
        this.newStudent = {
          name: '',
          email: '',
          password: '',
          role: 'student'
        };
      })
      .catch((err: any) => {
        console.error("Create error:", err);
        alert(err?.response?.data?.msg || "❌ Failed to create student");
      });
  }

  // ✅ DELETE STUDENT
  deleteStudent(id: string) {
    if (confirm("Delete student?")) {
      deleteUser(id)
        .then(() => {
          alert("✅ Student deleted");
          this.loadStudents();
        })
        .catch((err: any) => {
          console.error("Delete error:", err);
          alert("❌ Failed to delete student");
        });
    }
  }
}