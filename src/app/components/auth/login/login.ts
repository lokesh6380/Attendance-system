import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
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
export class Login implements OnInit, OnDestroy {

  email = '';
  password = '';
  errorMessage = '';
  isLoading = false;
  attempts = 0;
  lockTime = 0;
  shake = false;
  showPassword = false;
  private lockInterval: any;
  private lockStartTime: number = 0;

  constructor(private router: Router, private ngZone: NgZone) {}

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
  }

  ngOnInit() {
    this.restoreLockState();
  }

  ngOnDestroy() {
    if (this.lockInterval) {
      clearInterval(this.lockInterval);
    }
  }

  /* RESTORE LOCK AFTER REFRESH */
  restoreLockState() {
    if (!this.isBrowser()) {
      return;
    }

    const savedLockStartTime = localStorage.getItem('loginLockStartTime');
    const savedAttempts = localStorage.getItem('loginAttempts');

    if (savedLockStartTime) {
      const now = Date.now();
      const startTime = parseInt(savedLockStartTime);
      const elapsedSeconds = Math.floor((now - startTime) / 1000);
      const remainingTime = 60 - elapsedSeconds;

      if (remainingTime > 0) {
        this.lockTime = remainingTime;
        this.attempts = parseInt(savedAttempts || '3');
        this.startTimer();
      } else {
        this.clearLockState();
      }
    }
  }

  /* 🔥 FIXED TIMER (LIVE COUNTDOWN) */
  startTimer() {
    if (this.lockInterval) {
      clearInterval(this.lockInterval);
    }

    this.lockInterval = setInterval(() => {
      this.ngZone.run(() => {
        this.lockTime = Math.max(0, this.lockTime - 1);

        if (this.lockTime === 0) {
          this.clearLockState();
        }
      });
    }, 1000);
  }

  clearLockState() {
    if (this.lockInterval) {
      clearInterval(this.lockInterval);
      this.lockInterval = null;
    }

    this.lockTime = 0;
    this.attempts = 0;

    if (this.isBrowser()) {
      localStorage.removeItem('loginLockStartTime');
      localStorage.removeItem('loginAttempts');
      localStorage.removeItem('loginLockTime');
    }

    this.errorMessage = '';
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  triggerShake() {
    this.shake = true;
    setTimeout(() => this.shake = false, 500);
  }

  /* START LOCK */
  startLock() {
    if (this.lockInterval) {
      clearInterval(this.lockInterval);
    }

    this.lockTime = 60;
    this.lockStartTime = Date.now();

    if (this.isBrowser()) {
      localStorage.setItem('loginLockStartTime', this.lockStartTime.toString());
      localStorage.setItem('loginAttempts', this.attempts.toString());
    }

    this.startTimer();
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }

  onLogin() {

    if (this.lockTime > 0) {
      this.errorMessage = `🔒 Account locked. Try again in ${this.lockTime}s`;
      return;
    }

    if (!this.email || !this.password) {
      this.errorMessage = '❌ Please enter email and password';
      return;
    }

    this.errorMessage = '';
    this.isLoading = true;

    const users = JSON.parse(localStorage.getItem('users') || '[]');

    const user = users.find((u: any) =>
      u.email === this.email && u.password === this.password
    );

    if (user) {

      this.clearLockState();

      localStorage.setItem('currentUser', JSON.stringify(user));

      const role = user.role.toLowerCase();

      if (role === 'instructor') {
        this.router.navigate(['/instructor-dashboard/overview']);
      } else if (role === 'student') {
        this.router.navigate(['/student-dashboard']);
      } else if (role === 'sub master') {
        this.router.navigate(['/submaster-dashboard']);
      }

      this.isLoading = false;

    } else {

      this.attempts++;
      this.errorMessage = `❌ Invalid email or password (Attempt ${this.attempts}/3)`;
      this.triggerShake();
      this.isLoading = false;

      if (this.attempts >= 3) {
        this.startLock();
        this.errorMessage = `🔒 Too many failed attempts. Locked for ${this.lockTime}s`;
      }
    }
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