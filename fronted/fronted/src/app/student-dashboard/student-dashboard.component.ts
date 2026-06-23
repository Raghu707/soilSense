import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-student-dashboard',
  templateUrl: './student-dashboard.component.html',
  styleUrls: ['./student-dashboard.component.css']
})
export class StudentDashboardComponent implements OnInit {

   API_URL = "https://soilsense-1-zp8c.onrender.com/api";
  // API_URL = "http://localhost:5000/api";

  name = '';
  observations: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.name = localStorage.getItem("name") || "Student";

    this.loadObservations();
  }

  loadObservations() {

    const token = localStorage.getItem("token");

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    this.http.get<any[]>(`${this.API_URL}/observations`, { headers })
      .subscribe({
        next: (res) => {

          // ✅ Convert DB data to UI format
          this.observations = res.map(o => ({

            date: new Date(o.date).toLocaleDateString(),
            time: new Date(o.date).toLocaleTimeString(),

            weather: o.weather?.toLowerCase(),

            moisture: o.sensorReadingId?.humidity,
            temp: o.sensorReadingId?.temperatureC,

            notes: o.notes

          }));

        },
        error: (err) => {
          console.error(err);
          alert("❌ Failed to load observations");
        }
      });
  }
}