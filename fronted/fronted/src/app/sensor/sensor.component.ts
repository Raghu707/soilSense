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

  // ✅ updated sensor model
  newSensor: any = {
    deviceId: '',
    metalDescription: '',
    materialDescription: ''
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

    if (!this.newSensor.deviceId) {
      alert("Device ID required");
      return;
    }

    createSensor(this.newSensor).then(() => {
      this.loadSensors();
      this.closeModal();

      // ✅ reset form
      this.newSensor = {
        deviceId: '',
        metalDescription: '',
        materialDescription: ''
      };
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