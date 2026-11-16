import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-student-dashboard',
  templateUrl: './student-dashboard.component.html',
  styleUrls: ['./student-dashboard.component.css']
})
export class StudentDashboardComponent implements OnInit {

  //API_URL = 'http://localhost:5000/api';
 API_URL = 'https://soilsense-1-zp8c.onrender.com/api';
  name = 'Student';

  project = 'Not Assigned';
  sensor = 'Not Assigned';
  supervisor = 'Not Assigned';

  observationCount = 0;

  observations: any[] = [];

  constructor(
    private http: HttpClient
  ) {}

  ngOnInit(): void {

    const savedName =
      localStorage.getItem('name');

    this.name =
      savedName || 'Student';

    this.loadProfile();

    this.loadObservations();

  }

  loadProfile(): void {

    const token =
      localStorage.getItem('token');

    const headers =
      new HttpHeaders({
        Authorization: `Bearer ${token}`
      });

    this.http.get<any>(
      `${this.API_URL}/students/profile`,
      { headers }
    )
    .subscribe({

      next: (res) => {

        this.name =
          res.username || 'Student';

        this.project =
          res.project || 'Not Assigned';

        this.sensor =
          res.sensor || 'Not Assigned';

        this.supervisor =
          res.supervisor || 'Not Assigned';

        this.observationCount =
          res.observationCount || 0;

      },

      error: (err) => {

        console.error(err);

      }

    });

  }

  loadObservations(): void {

    const token =
      localStorage.getItem('token');

    const headers =
      new HttpHeaders({
        Authorization: `Bearer ${token}`
      });

    this.http.get<any[]>(
      `${this.API_URL}/observations`,
      { headers }
    )
    .subscribe({

      next: (res) => {

        this.observations = res.map(o => ({

          date:
            new Date(o.date)
            .toLocaleDateString(),

          time:
            new Date(o.date)
            .toLocaleTimeString(),

          weather:
            o.weather?.toLowerCase(),

          moisture:
            o.sensorReadingId?.humidity ?? 0,

          temp:
            o.sensorReadingId?.temperatureC ?? 0,

          notes:
            o.notes

        }));

      },

      error: (err) => {

        console.error(err);

        Swal.fire({

          icon: 'error',

          title: 'Load Failed',

          text: 'Failed to load observations.',

          confirmButtonColor: '#ef4444'

        });

      }

    });

  }

}