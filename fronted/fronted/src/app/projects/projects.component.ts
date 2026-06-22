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

  // ✅ Pair storage (student + sensor)
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

  /* =====================================
     ✅ LOAD DATA
  ===================================== */

  loadProjects() {
    getProjects()
      .then((res: any) => {

        // ✅ IMPORTANT: Normalize students (backend safe)
        this.projects = res.data.map((p: any) => {

          // handle both cases: studentId OR students[]
          let studentsList = [];

          if (p.students && Array.isArray(p.students)) {
            studentsList = p.students;
          } else if (p.studentId) {
            // fallback (single student)
            studentsList = [p.studentId];
          }

          return {
            ...p,
            students: studentsList
          };
        });

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

    // ✅ Reset state
    this.pairs = [];
    this.newProject.studentId = '';
    this.newProject.sensorId = '';
  }

  /* =====================================
     ✅ ADD PAIR (VALIDATION SAFE)
  ===================================== */

  addPair() {

    const { studentId, sensorId } = this.newProject;

    if (!studentId || !sensorId) {
      alert("Select both student and sensor");
      return;
    }

    // ❌ duplicate same pair
    if (this.pairs.find(p => p.studentId === studentId && p.sensorId === sensorId)) {
      alert("Pair already added");
      return;
    }

    // ❌ same sensor reused
    if (this.pairs.find(p => p.sensorId === sensorId)) {
      alert("This sensor is already assigned");
      return;
    }

    // ❌ same student reused
    if (this.pairs.find(p => p.studentId === studentId)) {
      alert("This student is already assigned");
      return;
    }

    // ✅ lookup
    const student = this.students.find(s => s._id === studentId);
    const sensor = this.sensors.find(s => s._id === sensorId);

    // ✅ push pair
    this.pairs.push({
      studentId,
      sensorId,
      studentName: student?.name || 'Unknown',
      sensorName: sensor?.deviceId || 'Unknown'
    });

    // ✅ reset selection
    this.newProject.studentId = '';
    this.newProject.sensorId = '';
  }

  /* =====================================
     ✅ REMOVE PAIR
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

    /*
      ✅ IMPORTANT CHANGE:
      Send ALL students instead of only first one
    */
    const payload = {
      name: this.newProject.name,
      description: this.newProject.description,
      location: this.newProject.location,
      startDate: this.newProject.startDate,
      endDate: this.newProject.endDate,

      // ✅ send arrays
      students: this.pairs.map(p => p.studentId),
      sensors: this.pairs.map(p => p.sensorId)
    };

    createProject(payload)
      .then(() => {

        alert("✅ Project + Student-Sensor mapping created");

        // ✅ reset everything
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