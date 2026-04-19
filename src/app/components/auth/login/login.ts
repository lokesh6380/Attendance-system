import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Navbar } from '../../navbar/navbar';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, Navbar],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent implements OnDestroy {

  email = '';
  password = '';
  showPassword = false;

  errorMessage = '';
  successMessage = '';
  isLoading = false;

  attempts = 0;
  lockTime = 0;

  shake = false;

  private timer: any;

  constructor(private router: Router) {}

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  onLogin() {

    if (this.lockTime > 0) return;

    this.errorMessage = '';
    this.successMessage = '';
    this.isLoading = true;

    setTimeout(() => {

      if (this.email === 'admin@gmail.com' && this.password === 'Admin123') {

        this.successMessage = 'Login successful ✅';
        this.errorMessage = '';

        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, 1000);

      } else {

        this.attempts++;
        this.errorMessage = 'Invalid email or password';

        // 🔥 SHAKE EFFECT
        this.triggerShake();

        if (this.attempts >= 3) {
          this.startLock();
        }
      }

      this.isLoading = false;

    }, 800);
  }

  triggerShake() {
    this.shake = true;
    setTimeout(() => this.shake = false, 400);
  }

  startLock() {
    this.lockTime = 60;

    if (this.timer) clearInterval(this.timer);

    this.timer = setInterval(() => {
      this.lockTime--;

      if (this.lockTime <= 0) {
        clearInterval(this.timer);
        this.attempts = 0;
      }
    }, 1000);
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }

  ngOnDestroy() {
    if (this.timer) clearInterval(this.timer);
  }
}