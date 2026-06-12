import { Component, OnInit } from '@angular/core';
import { getProjects, createProject } from '../services/api.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-admin-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})

export class AdminProjectsComponent implements OnInit {
constructor(private router: Router) {}
  // ✅ Project list
  projects: any[] = [];

  // ✅ Modal control
  showModal: boolean = false;

  // ✅ New project form
  newProject: any = {
    name: '',
    description: '',
    location: '',
    startDate: '',
    endDate: '',
    status: 'active'
  };

  // ✅ Load projects on page load
  ngOnInit(): void {
    this.loadProjects();
  }

  // ✅ GET projects
  loadProjects() {
    getProjects()
      .then((res: any) => {
        console.log("Projects:", res.data);
        this.projects = res.data;
      })
      .catch((err: any) => {
        console.error("Error loading projects:", err);
      });
  }

  // ✅ Open modal
  openModal() {
    this.showModal = true;
  }

  // ✅ Close modal
  closeModal() {
    this.showModal = false;
  }

  // ✅ Create project
  createProject() {

    // ✅ Validation
    if (!this.newProject.name) {
      alert("Project name required");
      return;
    }
    
    createProject(this.newProject)
      .then(() => {

        alert("✅ Project created successfully");

        // ✅ Close modal
        this.closeModal();

        // ✅ Reload projects
        this.loadProjects();

        // ✅ Reset form
        this.newProject = {
          name: '',
          description: '',
          location: '',
          startDate: '',
          endDate: '',
          status: 'active'
        };

      })
      .catch((err: any) => {
        console.error("Create error:", err);
        alert("❌ Failed to create project");
      });
  }
  openGraph(id: string) {
  this.router.navigate(['/admin/graph', id]);
}
}
