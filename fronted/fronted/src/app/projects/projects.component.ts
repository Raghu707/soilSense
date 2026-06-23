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

  /* ✅ LOAD DATA */
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

  /* ✅ MODAL */
  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.reset();
  }

  /* ✅ RESET */
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

  /* ✅ ADD PAIR */
  addPair() {
    const { studentId, sensorId } = this.newProject;

    if (!studentId || !sensorId) return alert("Select both");

    if (this.pairs.find(p => p.studentId === studentId)) {
      return alert("Student already assigned");
    }

    if (this.pairs.find(p => p.sensorId === sensorId)) {
      return alert("Sensor already used");
    }

    const student = this.students.find(s => s._id === studentId);
    const sensor = this.sensors.find(s => s._id === sensorId);

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

  /* ✅ CREATE + UPDATE */
  saveProject() {

    const payload = {
      ...this.newProject,
      students: this.pairs.map(p => p.studentId),
      sensors: this.pairs.map(p => p.sensorId)
    };

    if (this.editMode) {
      updateProject(this.editId, payload).then(() => {
        alert("✅ Updated");
        this.closeModal();
        this.loadProjects();
      });
    } else {
      createProject(payload).then(() => {
        alert("✅ Created");
        this.closeModal();
        this.loadProjects();
      });
    }
  }

  /* ✅ EDIT */
  editProject(p: any) {
    this.openModal();
    this.editMode = true;
    this.editId = p._id;

    this.newProject = {
      name: p.name,
      description: p.description,
      location: p.location,
      startDate: p.startDate?.substring(0,10),
      endDate: p.endDate?.substring(0,10),
      studentId: '',
      sensorId: ''
    };

    this.pairs = p.students.map((s: any, i: number) => ({
      studentId: s._id,
      sensorId: p.sensors[i]?._id,
      studentName: s.name,
      sensorName: p.sensors[i]?.deviceId
    }));
  }

  /* ✅ DELETE */
  deleteProject(id: string) {
    if (!confirm("Delete project?")) return;

    deleteProject(id).then(() => {
      alert("✅ Deleted");
      this.loadProjects();
    });
  }
  /* ✅ CHECK STUDENT USED */
isStudentUsed(studentId: string): boolean {
  return this.projects.some(project =>
    project.students?.some((s: any) => s._id === studentId) &&
    project._id !== this.editId // ✅ allow edit mode
  );
}

/* ✅ CHECK SENSOR USED */
isSensorUsed(sensorId: string): boolean {
  return this.projects.some(project =>
    project.sensors?.some((s: any) => s._id === sensorId) &&
    project._id !== this.editId
  );
}

  openGraph(id: string) {
    this.router.navigate(['/admin/graph', id]);
  }
}
