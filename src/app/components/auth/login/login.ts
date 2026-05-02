import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Navbar } from '../../navbar/navbar';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, Navbar],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {

  email = '';
  password = '';
  errorMessage = '';
  isLoading = false;
  attempts = 0;
  lockTime = 0;
  shake = false;
  showPassword = false;

  constructor(private router: Router) {}

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  triggerShake() {
    this.shake = true;
    setTimeout(() => {
      this.shake = false;
    }, 500);
  }

  startLock() {
    this.lockTime = 60;
    const interval = setInterval(() => {
      this.lockTime--;
      if (this.lockTime <= 0) {
        clearInterval(interval);
        this.attempts = 0;
      }
    }, 1000);
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }

  onLogin() {

    if (this.lockTime > 0) return;

    this.errorMessage = '';
    this.isLoading = true;

    setTimeout(() => {

      const users = JSON.parse(localStorage.getItem('users') || '[]');

      const user = users.find((u: any) =>
        u.email === this.email && u.password === this.password
      );

      if (user) {

        localStorage.setItem('currentUser', JSON.stringify(user));

        // ROLE BASED NAVIGATION (case-insensitive)
        const role = user.role.toLowerCase();
        if (role === 'instructor') {
          this.router.navigate(['/instructor-dashboard/overview']);
        } else if (role === 'student') {
          this.router.navigate(['/student-dashboard']);
        } else if (role === 'sub master') {
          this.router.navigate(['/submaster-dashboard']);
        }

      } else {

        this.attempts++;
        this.errorMessage = 'Invalid email or password';
        this.triggerShake();

        if (this.attempts >= 3) {
          this.startLock();
        }
      }

      this.isLoading = false;

    }, 800);
  }

  /* FORGOT PASSWORD */
  forgotPassword() {
    const users = JSON.parse(localStorage.getItem('users') || '[]');

    const user = users.find((u: any) => u.email === this.email);

    if (!this.email) {
      this.errorMessage = 'Enter email first';
      return;
    }

    if (user) {
      alert(`Your password is: ${user.password}`);
    } else {
      this.errorMessage = 'Email not found';
    }
  }
}