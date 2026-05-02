import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-shared-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './shared-navbar.html',
  styleUrls: ['./shared-navbar.css']
})
export class SharedNavbarComponent {

  constructor(private router: Router) {}

  goToProfile() {
    this.router.navigate(['/instructor/profile']);
  }

  goToDashboard() {
    this.router.navigate(['/instructor/dashboard']);
  }

  goToStudents() {
    this.router.navigate(['/instructor/students']);
  }

  goToAttendance() {
    this.router.navigate(['/instructor/attendance']);
  }

  logout() {
    // clear session or token
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    // redirect to login
    this.router.navigate(['/login']);
  }
}