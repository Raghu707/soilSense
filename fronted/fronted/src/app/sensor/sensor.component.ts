import { Component, OnInit } from '@angular/core';
import { getSensors, createSensor, deleteSensor } from '../services/api.service';

@Component({
  selector: 'app-admin-sensors',
 templateUrl: './sensor.component.html',
  styleUrls: ['./sensor.component.css']
})
export class SensorComponent implements OnInit {

  name = '';
  sensors: any[] = [];

  // ✅ modal
  showModal = false;

  // ✅ new sensor form
  newSensor: any = {
    sensorId: '',
    status: 'online',
    battery: 100
  };

  ngOnInit() {
    this.name = localStorage.getItem("name") || "Professor";
    this.loadSensors();
  }

  loadSensors() {
    getSensors().then((res: any) => {
      this.sensors = res.data;
    });
  }

  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  createSensor() {
    createSensor(this.newSensor).then(() => {
      this.loadSensors();
      this.closeModal();
    });
  }

  deleteSensor(id: string) {
    if (confirm("Delete sensor?")) {
      deleteSensor(id).then(() => {
        this.loadSensors();
      });
    }
  }
}