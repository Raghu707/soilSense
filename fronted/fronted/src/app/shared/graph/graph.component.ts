import { Component, OnInit } from '@angular/core';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css']
})
export class GraphComponent implements OnInit {

  ngOnInit() {
    this.loadCharts();
  }

  loadCharts() {

    // ✅ MOISTURE
    new Chart('moistureChart', {
      type: 'line',
      data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
          label: 'Moisture (%)',
          data: [34, 28, 40, 30, 45, 35, 29],
          borderColor: '#3b82f6',
          fill: false,
          tension: 0.4
        }]
      }
    });

    // ✅ TEMPERATURE
    new Chart('tempChart', {
      type: 'line',
      data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
          label: 'Temp (°C)',
          data: [18, 22, 20, 23, 21, 24, 22],
          borderColor: '#f97316',
          fill: false,
          tension: 0.4
        }]
      }
    });

  }
}