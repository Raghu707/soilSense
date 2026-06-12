import { Component, OnInit } from '@angular/core';

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
    studentId: '',
    email: '',
    seminar: '',
    project: '',
    status: 'active'
  };

  ngOnInit() {

    // ✅ TEMP DATA (connect API later)
    this.students = [
      {
        name: 'Anna Kowalski',
        studentId: 'STU-001',
        email: 'anna@test.com',
        seminar: 'SEM-2026-04',
        project: 'North field',
        status: 'Active'
      },
      {
        name: 'Mateusz',
        studentId: 'STU-002',
        email: 'mateusz@test.com',
        seminar: 'SEM-2026-04',
        project: 'South plot',
        status: 'Active'
      }
    ];
  }

  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  createStudent() {
    this.students.push({ ...this.newStudent });

    this.closeModal();

    this.newStudent = {
      name: '',
      studentId: '',
      email: '',
      seminar: '',
      project: '',
      status: 'active'
    };
  }

  deleteStudent(index: number) {
    if (confirm("Delete student?")) {
      this.students.splice(index, 1);
    }
  }
}