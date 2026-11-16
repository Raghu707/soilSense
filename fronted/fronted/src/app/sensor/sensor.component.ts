import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';

import {
  getSensors,
  createSensor,
  deleteSensor
} from '../services/api.service';

@Component({
  selector: 'app-admin-sensors',
  templateUrl: './sensor.component.html',
  styleUrls: ['./sensor.component.css']
})
export class SensorComponent implements OnInit {

  name = '';

  sensors: any[] = [];

  // Modal
  showModal = false;

  newSensor: any = {
    deviceId: '',
    metalDescription: '',
    materialDescription: ''
  };

  ngOnInit(): void {

    this.name =
      localStorage.getItem('name')
      || 'Professor';

    this.loadSensors();

  }

  loadSensors(): void {

    getSensors().then((res: any) => {

      this.sensors = res.data;

    });

  }

  openModal(): void {

    this.showModal = true;

  }

  closeModal(): void {

    this.showModal = false;

  }

  createSensor(): void {

    if (!this.newSensor.deviceId) {

      Swal.fire({

        icon: 'warning',

        title: 'Device ID Required',

        text: 'Please enter a valid Sensor Device ID.',

        confirmButtonColor: '#f59e0b'

      });

      return;

    }

    createSensor(this.newSensor).then(() => {

      this.loadSensors();

      this.closeModal();

      this.newSensor = {
        deviceId: '',
        metalDescription: '',
        materialDescription: ''
      };

      Swal.fire({

        icon: 'success',

        title: 'Sensor Added',

        text: 'Sensor has been created successfully.',

        confirmButtonColor: '#22c55e'

      });

    });

  }

  deleteSensor(id: string): void {

    Swal.fire({

      title: 'Delete Sensor?',

      text: 'This action cannot be undone.',

      icon: 'warning',

      showCancelButton: true,

      confirmButtonText: 'Delete',

      cancelButtonText: 'Cancel',

      confirmButtonColor: '#ef4444',

      cancelButtonColor: '#6b7280'

    }).then((result) => {

      if (result.isConfirmed) {

        deleteSensor(id).then(() => {

          this.loadSensors();

          Swal.fire({

            icon: 'success',

            title: 'Deleted Successfully',

            text: 'Sensor removed successfully.',

            confirmButtonColor: '#22c55e'

          });

        });

      }

    });

  }

}