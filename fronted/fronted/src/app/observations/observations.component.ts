import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AlertService } from '../services/alert.service';

@Component({
  selector: 'app-observations',
  templateUrl: './observations.component.html',
  styleUrls: ['./observations.component.css']
})
export class ObservationsComponent implements OnInit {

   API_URL = 'https://soilsense-1-zp8c.onrender.com/api';
  //API_URL = 'http://localhost:5000/api';

  project = 'Loading...';

  today = new Date();

  location = '';
  weather = 'Sunny';
  wind = 'Calm';
  notes = '';

  sensor = {
    humidity: null as number | null,
    temperatureC: null as number | null,
    battery: null as number | null,
    readingId: ''
  };

  loading = false;

  constructor(
    private http: HttpClient,
    private alert: AlertService
  ) {}

  ngOnInit(): void {

    this.loadProfile();

  }

  loadProfile(): void {

    const token =
      localStorage.getItem('token');

    if (!token) {
      return;
    }

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

        this.project =
          res.project || 'Not Assigned';

      },

      error: (err) => {

        console.error(err);

        this.project =
          'Not Assigned';

      }

    });

  }

  fetchSensor(): void {

    this.loading = true;

    this.http.get<any>(
      `${this.API_URL}/sensors/data`
    )
    .subscribe({

      next: (res) => {

        const data =
          res.record;

        this.sensor = {

          humidity:
            data.humidity,

          temperatureC:
            data.temperatureC,

          battery:
            data.battery,

          readingId:
            data._id

        };

        this.loading = false;

      },

      error: () => {

        this.loading = false;

        this.alert.error(
          'Fetch Failed',
          'Failed to fetch sensor data.'
        );

      }

    });

  }

  save(): void {

    if (!this.sensor.readingId) {

      this.alert.warning(
        'Sensor Required',
        'Please fetch sensor data before saving.'
      );

      return;

    }

    const payload = {

      sensorReadingId:
        this.sensor.readingId,

      date:
        new Date(),

      location:
        this.location,

      weather:
        this.weather,

      wind:
        this.wind,

      notes:
        this.notes

    };

    const token =
      localStorage.getItem('token');

    if (!token) {

      this.alert.error(
        'Login Required',
        'No token found. Please login again.'
      );

      return;

    }

    const headers =
      new HttpHeaders({
        Authorization: `Bearer ${token}`
      });

    this.http.post(
      `${this.API_URL}/observations`,
      payload,
      { headers }
    )
    .subscribe({

      next: () => {

        this.alert.success(
          'Observation Saved',
          'Sensor data has been recorded successfully.'
        );

        this.resetForm();

      },

      error: (err) => {

        console.error(err);

        this.alert.error(
          'Save Failed',
          'Failed to save observation. Please try again.'
        );

      }

    });

  }

  resetForm(): void {

    this.location = '';
    this.notes = '';
    this.wind = 'Calm';

  }

}