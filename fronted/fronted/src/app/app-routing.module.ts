import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// ✅ Auth
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

// ✅ Shared Layout
import { LayoutComponent } from './shared/layout/layout.component';

// ✅ Admin pages

// import { AdminStudentsComponent } from '../students/admin-students.component';
// import { AdminSensorsComponent } from './admin-sensors/admin-sensors.component';

// ✅ Student pages (create if not yet)
// import { StudentProjectsComponent } from './student-projects/student-projects.component';
// import { StudentSensorsComponent } from './student-sensors/student-sensors.component';
import { ObservationsComponent } from './observations/observations.component';
import { AdminProjectsComponent } from './projects/projects.component';
import { SensorComponent } from './sensor/sensor.component';
import { StudentComponent } from './student/student.component';
import { StudentDashboardComponent } from './student-dashboard/student-dashboard.component';
import { GraphComponent } from './shared/graph/graph.component';
import { ProfileComponent } from './profile/profile.component';

const routes: Routes = [

  /* ===============================
     ✅ AUTH PAGES (NO SIDEBAR)
  =============================== */
  { path: '', component: LoginComponent },
  { path: 'register', component: RegisterComponent },


  /* ===============================
     ✅ ADMIN SECTION (WITH SIDEBAR)
  =============================== */
  {
    path: 'admin',
    component: LayoutComponent,
    children: [
      { path: 'projects', component: AdminProjectsComponent },
      { path: 'students', component: StudentComponent },
      { path: 'sensors', component: SensorComponent },
      { path: 'graph/:id', component: GraphComponent },
      { path: 'profile', component: ProfileComponent },


      // ✅ default route
      { path: '', redirectTo: 'projects', pathMatch: 'full' }
    ]
  },


  /* ===============================
     ✅ STUDENT SECTION (SAME LAYOUT)
  =============================== */
  {
    path: 'student',
    component: LayoutComponent,
    children: [
      // { path: 'projects', component: StudentProjectsComponent },
      { path: 'dashboard', component: StudentDashboardComponent },
      { path: 'observations', component: ObservationsComponent },
      { path: 'graph/:id', component: GraphComponent },
      { path: 'profile', component: ProfileComponent },

      // ✅ default route
      { path: '', redirectTo: 'projects', pathMatch: 'full' }
    ]
  },


  /* ===============================
     ✅ FALLBACK (IMPORTANT)
  =============================== */
  { path: '**', redirectTo: '' }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}