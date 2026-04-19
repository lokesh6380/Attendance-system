import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './landing-page.html',
  styleUrls: ['./landing-page.css']
})
export class LandingPageComponent {

  isDarkMode = false;

  constructor(private router: Router) {}

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}