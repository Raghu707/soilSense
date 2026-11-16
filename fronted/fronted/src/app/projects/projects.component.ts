import { Component, OnInit } from '@angular/core';

import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
  getStudents,
  getSensors
} from '../services/api.service';

import { Router } from '@angular/router';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class AdminProjectsComponent implements OnInit {

  constructor(private router: Router) {}

  projects: any[] = [];
  students: any[] = [];
  sensors: any[] = [];

  showModal = false;
  editMode = false;
  editId = '';

  pairs: any[] = [];

  newProject: any = {
    name: '',
    description: '',
    location: '',
    startDate: '',
    endDate: '',
    studentId: '',
    sensorId: ''
  };

  ngOnInit(): void {

    this.loadProjects();
    this.loadStudents();
    this.loadSensors();

  }

  /* LOAD */

  loadProjects() {

    getProjects().then((res: any) => {

      this.projects = res.data;

    });

  }

  loadStudents() {

    getStudents().then((res: any) => {

      this.students = res.data;

    });

  }

  loadSensors() {

    getSensors().then((res: any) => {

      this.sensors = res.data;

    });

  }

  /* MODAL */

  openModal() {

    this.showModal = true;

  }

  closeModal() {

    this.showModal = false;

    this.reset();

  }

  /* RESET */

  reset() {

    this.editMode = false;

    this.editId = '';

    this.pairs = [];

    this.newProject = {
      name: '',
      description: '',
      location: '',
      startDate: '',
      endDate: '',
      studentId: '',
      sensorId: ''
    };

  }

  /* ADD PAIR */

  addPair() {

    const { studentId, sensorId } = this.newProject;

    if (!studentId || !sensorId) {

      Swal.fire({
        icon: 'warning',
        title: 'Selection Required',
        text: 'Please select both Student and Sensor.',
        confirmButtonColor: '#f59e0b'
      });

      return;
    }

    if (this.pairs.find(p => p.studentId === studentId)) {

      Swal.fire({
        icon: 'warning',
        title: 'Student Already Assigned',
        text: 'This student has already been added.',
        confirmButtonColor: '#f59e0b'
      });

      return;
    }

    if (this.pairs.find(p => p.sensorId === sensorId)) {

      Swal.fire({
        icon: 'warning',
        title: 'Sensor Already Used',
        text: 'This sensor has already been added.',
        confirmButtonColor: '#f59e0b'
      });

      return;
    }

    const student =
      this.students.find(s => s._id === studentId);

    const sensor =
      this.sensors.find(s => s._id === sensorId);

    this.pairs.push({

      studentId,

      sensorId,

      studentName: student?.name,

      sensorName: sensor?.deviceId

    });

    this.newProject.studentId = '';
    this.newProject.sensorId = '';

  }

  removePair(i: number) {

    this.pairs.splice(i, 1);

  }

  /* CREATE + UPDATE */

  saveProject() {

    const payload = {

      ...this.newProject,

      students: this.pairs.map(
        p => p.studentId
      ),

      sensors: this.pairs.map(
        p => p.sensorId
      )

    };

    if (this.editMode) {

      updateProject(
        this.editId,
        payload
      ).then(() => {

        this.closeModal();

        this.loadProjects();

        Swal.fire({

          icon: 'success',

          title: 'Project Updated',

          text: 'Project updated successfully.',

          confirmButtonColor: '#22c55e'

        });

      });

    } else {

      createProject(payload).then(() => {

        this.closeModal();

        this.loadProjects();

        Swal.fire({

          icon: 'success',

          title: 'Project Created',

          text: 'Project created successfully.',

          confirmButtonColor: '#22c55e'

        });

      });

    }

  }

  /* EDIT */

  editProject(p: any) {

    this.openModal();

    this.editMode = true;

    this.editId = p._id;

    this.newProject = {

      name: p.name,

      description: p.description,

      location: p.location,

      startDate: p.startDate?.substring(0, 10),

      endDate: p.endDate?.substring(0, 10),

      studentId: '',

      sensorId: ''

    };

    this.pairs = p.students.map(
      (s: any, i: number) => ({

        studentId: s._id,

        sensorId: p.sensors[i]?._id,

        studentName: s.name,

        sensorName: p.sensors[i]?.deviceId

      })
    );

  }

  /* DELETE */

  deleteProject(id: string) {

    Swal.fire({

      title: 'Delete Project?',

      text: 'This action cannot be undone.',

      icon: 'warning',

      showCancelButton: true,

      confirmButtonColor: '#ef4444',

      cancelButtonColor: '#6b7280',

      confirmButtonText: 'Delete',

      cancelButtonText: 'Cancel'

    }).then((result) => {

      if (result.isConfirmed) {

        deleteProject(id).then(() => {

          this.loadProjects();

          Swal.fire({

            icon: 'success',

            title: 'Deleted Successfully',

            text: 'Project removed successfully.',

            confirmButtonColor: '#22c55e'

          });

        });

      }

    });

  }

  /* CHECK STUDENT USED */

  isStudentUsed(studentId: string): boolean {

    return this.projects.some(project =>

      project.students?.some(
        (s: any) => s._id === studentId
      ) &&

      project._id !== this.editId

    );

  }

  /* CHECK SENSOR USED */

  isSensorUsed(sensorId: string): boolean {

    return this.projects.some(project =>

      project.sensors?.some(
        (s: any) => s._id === sensorId
      ) &&

      project._id !== this.editId

    );

  }

  openGraph(id: string) {

    this.router.navigate([
      '/admin/graph',
      id
    ]);

  }

}