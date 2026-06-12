import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from '../app/login/login.component';
import { RegisterComponent } from '../app/register/register.component';
import { AdminProjectsComponent } from '../app/projects/projects.component';
import { SensorsComponent } from '../app/sensors/sensors.component';
import { ObservationsComponent } from '../app/observations/observations.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { StudentDashboardComponent } from './student-dashboard/student-dashboard.component';
import { LayoutComponent } from './shared/layout/layout.component';
import { SensorComponent } from './sensor/sensor.component';
import { StudentComponent } from './student/student.component';
import { GraphComponent } from './shared/graph/graph.component';
import { ProfileComponent } from './profile/profile.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    AdminDashboardComponent,
    StudentDashboardComponent,
    AdminProjectsComponent,
    SensorsComponent,
    ObservationsComponent,
    AdminDashboardComponent,
    StudentDashboardComponent,
    LayoutComponent,
    SensorComponent,
    StudentComponent,
    GraphComponent,
    ProfileComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
