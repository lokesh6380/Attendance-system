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
  showPassword = false;
  shake = false;

  private lockInterval: any;
  private LOCK_DURATION = 60; // seconds

  constructor(private router: Router, private ngZone: NgZone) {}

  /* ✅ CHECK BROWSER */
  private isBrowser(): boolean {
    return typeof window !== 'undefined' && !!window.localStorage;
  }

  /* ✅ INIT */
  ngOnInit() {
    this.restoreLockState();
  }

  ngOnDestroy() {
    if (this.lockInterval) {
      clearInterval(this.lockInterval);
    }
  }

  /* ✅ RESTORE LOCK AFTER REFRESH */
  restoreLockState() {
    if (!this.isBrowser()) return;

    const savedStart = localStorage.getItem('loginLockStartTime');
    const savedAttempts = localStorage.getItem('loginAttempts');

    if (savedStart) {
      const elapsed = Math.floor((Date.now() - +savedStart) / 1000);
      const remaining = this.LOCK_DURATION - elapsed;

      if (remaining > 0) {
        this.lockTime = remaining;
        this.attempts = +(savedAttempts || 0);
        this.startTimer();
      } else {
        this.clearLockState();
      }
    }
  }

  /* ✅ TIMER */
  startTimer() {
    if (this.lockInterval) clearInterval(this.lockInterval);

    this.lockInterval = setInterval(() => {
      this.ngZone.run(() => {
        this.lockTime--;

        if (this.lockTime <= 0) {
          this.clearLockState();
        }
      });
    }, 1000);
  }

  /* ✅ CLEAR LOCK */
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
    }

    this.errorMessage = '';
  }

  /* ✅ START LOCK */
  startLock() {
    this.lockTime = this.LOCK_DURATION;

    if (this.isBrowser()) {
      localStorage.setItem('loginLockStartTime', Date.now().toString());
      localStorage.setItem('loginAttempts', this.attempts.toString());
    }

    this.startTimer();
  }

  /* ✅ TOGGLE PASSWORD */
  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  /* ✅ SHAKE EFFECT */
  triggerShake() {
    this.shake = true;
    setTimeout(() => (this.shake = false), 500);
  }

  /* ✅ LOGIN FUNCTION */
  onLogin() {

    if (this.lockTime > 0) {
      this.errorMessage = `🔒 Locked. Try again in ${this.lockTime}s`;
      return;
    }

    if (!this.email.trim() || !this.password.trim()) {
      this.errorMessage = '❌ Enter email and password';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const users = JSON.parse(localStorage.getItem('users') || '[]');

    console.log('Users:', users);
    console.log('Entered:', this.email, this.password);

    const user = users.find((u: any) =>
      u.email?.trim().toLowerCase() === this.email.trim().toLowerCase() &&
      u.password?.trim() === this.password.trim()
    );

    if (user) {
      /* ✅ SUCCESS */
      this.clearLockState();

      localStorage.setItem('currentUser', JSON.stringify(user));

      const role = (user.role || '').toLowerCase();

      if (role === 'instructor') {
        this.router.navigate(['/instructor-dashboard/overview']);
      } else if (role === 'student') {
        this.router.navigate(['/student-dashboard']);
      } else if (role === 'sub master') {
        this.router.navigate(['/submaster-dashboard']);
      } else {
        this.router.navigate(['/']);
      }

      this.isLoading = false;

    } else {
      /* ❌ FAILURE */
      this.attempts++;
      this.triggerShake();
      this.isLoading = false;

      if (this.attempts >= 3) {
        this.startLock();
        this.errorMessage = `🔒 Too many attempts. Locked for ${this.lockTime}s`;
      } else {
        this.errorMessage = `❌ Invalid credentials (${this.attempts}/3)`;
      }
    }
  }

  /* ✅ FORGOT PASSWORD */
  forgotPassword() {
    if (!this.email.trim()) {
      this.errorMessage = 'Enter email first';
      return;
    }

    const users = JSON.parse(localStorage.getItem('users') || '[]');

    const user = users.find((u: any) =>
      u.email?.trim().toLowerCase() === this.email.trim().toLowerCase()
    );

    if (user) {
      alert(`Your password is: ${user.password}`);
    } else {
      this.errorMessage = 'Email not found';
    }
  }

  /* ✅ NAVIGATION */
  goToRegister() {
    this.router.navigate(['/register']);
  }
}