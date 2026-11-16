import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import Chart from 'chart.js/auto';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css']
})
export class GraphComponent implements OnInit {

  //API_URL = 'http://localhost:5000/api';
 API_URL = 'https://soilsense-1-zp8c.onrender.com/api';
  projectId = '';

  projectName = '';
  sensorName = '';

  allLabels: string[] = [];
  allHumidity: number[] = [];
  allTemperature: number[] = [];

  humidityRange = 'all';
  temperatureRange = 'all';

  humidityChart: any;
  tempChart: any;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient
  ) {}

  ngOnInit(): void {

    this.projectId =
      this.route.snapshot.paramMap.get('id') || '';

    this.loadGraphData();

  }

  loadGraphData(): void {

    const token =
      localStorage.getItem('token');

    const headers =
      new HttpHeaders({
        Authorization: `Bearer ${token}`
      });

    this.http.get<any>(
      `${this.API_URL}/projects/${this.projectId}/graph`,
      { headers }
    )
    .subscribe({

      next: (res) => {

        this.projectName =
          res.projectName;

        this.sensorName =
          res.sensorName;

        this.allLabels =
          res.labels;

        this.allHumidity =
          res.humidity;

        this.allTemperature =
          res.temperature;

        this.filterHumidity('all');
        this.filterTemperature('all');

      },

      error: (err) => {

        console.error(err);

        Swal.fire({

          icon: 'error',

          title: 'Graph Load Failed',

          text: 'Failed to load graph data.',

          confirmButtonColor: '#ef4444'

        });

      }

    });

  }

  getFilteredIndexes(range: string): number[] {

    const total =
      this.allLabels.length;

    if (range === '24h') {

      return [...Array(Math.min(5, total)).keys()]
        .map(i => total - Math.min(5, total) + i);

    }

    if (range === '7d') {

      return [...Array(Math.min(10, total)).keys()]
        .map(i => total - Math.min(10, total) + i);

    }

    if (range === '1m') {

      return [...Array(Math.min(20, total)).keys()]
        .map(i => total - Math.min(20, total) + i);

    }

    return [...Array(total).keys()];

  }

  filterHumidity(range: string): void {

    this.humidityRange = range;

    const indexes =
      this.getFilteredIndexes(range);

    const labels =
      indexes.map(i => this.allLabels[i]);

    const data =
      indexes.map(i => this.allHumidity[i]);

    this.renderHumidityChart(
      labels,
      data
    );

  }

  filterTemperature(range: string): void {

    this.temperatureRange = range;

    const indexes =
      this.getFilteredIndexes(range);

    const labels =
      indexes.map(i => this.allLabels[i]);

    const data =
      indexes.map(i => this.allTemperature[i]);

    this.renderTemperatureChart(
      labels,
      data
    );

  }

  renderHumidityChart(
    labels: string[],
    data: number[]
  ): void {

    if (this.humidityChart) {

      this.humidityChart.destroy();

    }

    this.humidityChart =
      new Chart('moistureChart', {

        type: 'line',

        data: {

          labels,

          datasets: [
            {
              label: 'Humidity (%)',

              data,

              borderColor: '#6366F1',

              backgroundColor:
                'rgba(99,102,241,0.15)',

              fill: true,

              tension: 0.45,

              borderWidth: 3,

              pointRadius: 5,

              pointHoverRadius: 7,

              pointBackgroundColor:
                '#6366F1'
            }
          ]

        },

        options: {

          responsive: true,

          maintainAspectRatio: false

        }

      });

  }

  renderTemperatureChart(
    labels: string[],
    data: number[]
  ): void {

    if (this.tempChart) {

      this.tempChart.destroy();

    }

    this.tempChart =
      new Chart('tempChart', {

        type: 'line',

        data: {

          labels,

          datasets: [
            {
              label: 'Temperature (°C)',

              data,

              borderColor: '#F97316',

              backgroundColor:
                'rgba(249,115,22,0.15)',

              fill: true,

              tension: 0.45,

              borderWidth: 3,

              pointRadius: 5,

              pointHoverRadius: 7,

              pointBackgroundColor:
                '#F97316'
            }
          ]

        },

        options: {

          responsive: true,

          maintainAspectRatio: false

        }

      });

  }

}