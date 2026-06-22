import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-observations',
  templateUrl: './observations.component.html',
  styleUrls: ['./observations.component.css']
})
export class ObservationsComponent {

 API_URL = "https://soilsense-1-zp8c.onrender.com/api";

//API_URL = "http://localhost:5000/api";

  project = 'North field — wheat trial';
  today = new Date();

  location: string = '';
  weather: string = 'Sunny';
  wind: string = 'Calm';
  notes: string = '';

  sensor = {
    humidity: null as number | null,
    temperatureC: null as number | null,
    battery: null as number | null,
    readingId: ""
  };

  loading = false;

  constructor(private http: HttpClient) {}

  // ✅ FETCH SENSOR DATA
  fetchSensor() {
    this.loading = true;

    this.http.get<any>(`${this.API_URL}/sensors/data`)
      .subscribe({
        next: (res) => {
          const data = res.record;

          this.sensor = {
            humidity: data.humidity,
            temperatureC: data.temperatureC,
            battery: data.battery,
            readingId: data._id
          };

          this.loading = false;
        },
        error: () => {
          alert("❌ Failed to fetch sensor");
          this.loading = false;
        }
      });
  }

  // ✅ SAVE OBSERVATION (WITH TOKEN ✅)
  save() {

    if (!this.sensor.readingId) {
      alert("⚠️ Fetch sensor first!");
      return;
    }

    const payload = {
      sensorReadingId: this.sensor.readingId,
      date: new Date(),
      location: this.location,
      weather: this.weather,
      wind: this.wind,
      notes: this.notes
    };

    // ✅ GET TOKEN FROM LOGIN
    const token = localStorage.getItem("token");

    if (!token) {
      alert("❌ No token found. Please login again.");
      return;
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    this.http.post(`${this.API_URL}/observations`, payload, { headers })
      .subscribe({
        next: () => {
          alert("✅ Observation Saved!");
          this.resetForm();
        },
        error: (err) => {
          console.error(err);
          alert("❌ Save failed (Check token)");
        }
      });
  }

  resetForm() {
    this.location = '';
    this.notes = '';
    this.wind = 'Calm';
  }
}