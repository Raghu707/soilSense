import Swal from 'sweetalert2';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  success(title: string, text: string) {

    Swal.fire({
      icon: 'success',
      title,
      text,

      confirmButtonColor: '#22c55e',

      background: '#ffffff',

      customClass: {
        popup: 'soil-popup'
      }
    });

  }

  error(title: string, text: string) {

    Swal.fire({
      icon: 'error',
      title,
      text,

      confirmButtonColor: '#ef4444'
    });

  }

  warning(title: string, text: string) {

    Swal.fire({
      icon: 'warning',
      title,
      text,

      confirmButtonColor: '#f59e0b'
    });

  }

  async confirm(title: string, text: string) {

    return Swal.fire({

      title,

      text,

      icon: 'warning',

      showCancelButton: true,

      confirmButtonText: 'Delete',

      cancelButtonText: 'Cancel',

      confirmButtonColor: '#ef4444',

      cancelButtonColor: '#6b7280'

    });

  }

}