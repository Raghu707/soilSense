import { Component, OnInit } from '@angular/core';
import {
  getProjects,
  createProject,
  getStudents,
  getSensors
} from '../services/api.service';

import { Router } from '@angular/router';

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

  showModal: boolean = false;

  // ✅ ✅ TEMP STORAGE (FINAL KEY FEATURE)
  pairs: any[] = [];

  newProject: any = {
    name: '',
    description: '',
    location: '',
    startDate: '',
    endDate: '',
    status: 'active',
    studentId: '',
    sensorId: ''
  };

  ngOnInit(): void {
    this.loadProjects();
    this.loadStudents();
    this.loadSensors();
  }

  /* =====================================
     ✅ LOAD DATA
  ===================================== */

  loadProjects() {
    getProjects()
      .then((res: any) => {
        this.projects = res.data;
      })
      .catch((err: any) => {
        console.error("Error loading projects:", err);
      });
  }

  loadStudents() {
    getStudents()
      .then((res: any) => {
        this.students = res.data;
      })
      .catch((err: any) => {
        console.error("Error loading students:", err);
      });
  }

  loadSensors() {
    getSensors()
      .then((res: any) => {
        this.sensors = res.data;
      })
      .catch((err: any) => {
        console.error("Error loading sensors:", err);
      });
  }

  /* =====================================
     ✅ MODAL CONTROL
  ===================================== */

  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;

    // ✅ reset everything when closing
    this.pairs = [];
    this.newProject.studentId = '';
    this.newProject.sensorId = '';
  }

  /* =====================================
     ✅ ADD PAIR (CHIP LOGIC)
  ===================================== */

  addPair() {

  const { studentId, sensorId } = this.newProject;

  if (!studentId || !sensorId) {
    alert("Select both student and sensor");
    return;
  }

  // ❌ prevent duplicate exact pair
  const pairExists = this.pairs.find(
    p => p.studentId === studentId && p.sensorId === sensorId
  );
  if (pairExists) {
    alert("Pair already added");
    return;
  }

  // ❌ prevent SAME SENSOR reuse
  const sensorUsed = this.pairs.find(
    p => p.sensorId === sensorId
  );
  if (sensorUsed) {
    alert("This sensor is already assigned in another pair");
    return;
  }

  // ❌ prevent SAME STUDENT reuse ✅ NEW LOGIC
  const studentUsed = this.pairs.find(
    p => p.studentId === studentId
  );
  if (studentUsed) {
    alert("This student is already assigned to a sensor");
    return;
  }

  // ✅ find display values
  const student = this.students.find(s => s._id === studentId);
  const sensor = this.sensors.find(s => s._id === sensorId);

  // ✅ push pair
  this.pairs.push({
    studentId,
    sensorId,
    studentName: student?.name,
    sensorName: sensor?.deviceId
  });

  // ✅ reset dropdown
  this.newProject.studentId = '';
  this.newProject.sensorId = '';
}

  /* =====================================
     ✅ REMOVE CHIP
  ===================================== */

  removePair(index: number) {
    this.pairs.splice(index, 1);
  }

  /* =====================================
     ✅ CREATE PROJECT
  ===================================== */

  createProject() {

    if (!this.newProject.name) {
      alert("Project name required");
      return;
    }

    if (this.pairs.length === 0) {
      alert("Add at least one pair");
      return;
    }

    // ✅ send first pair for main project
    const payload = {
      ...this.newProject,
      studentId: this.pairs[0].studentId,
      sensorId: this.pairs[0].sensorId
    };

    createProject(payload)
      .then(() => {

        alert("✅ Project + Mapping created");

        // ✅ reset everything
        this.pairs = [];

        this.newProject = {
          name: '',
          description: '',
          location: '',
          startDate: '',
          endDate: '',
          status: 'active',
          studentId: '',
          sensorId: ''
        };

        this.closeModal();
        this.loadProjects();

      })
      .catch((err: any) => {
        console.error("Create error:", err);
        alert(err?.response?.data?.message || "❌ Failed");
      });
  }

  /* =====================================
     ✅ NAVIGATION
  ===================================== */

  openGraph(id: string) {
    this.router.navigate(['/admin/graph', id]);
  }
}