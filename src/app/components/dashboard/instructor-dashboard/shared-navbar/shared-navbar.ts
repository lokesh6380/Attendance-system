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

  goToprofile() {
    this.router.navigate(['/instructor-dashboard/profile']);
  }

  goToDashboard() {
    this.router.navigate(['/instructor-dashboard/overview']);
  }

goToOverview() {
    this.router.navigate(['/instructor-dashboard/overview']);
  }

  goToStudents() {
    this.router.navigate(['/instructor-dashboard/students']);
  }

  goToAttendance() {
    this.router.navigate(['/instructor-dashboard/attendance']);
  }

  logout() {
    // clear session or token
    localStorage.removeItem('currentUser');

    // redirect to login
    this.router.navigate(['/login']);
  }
}