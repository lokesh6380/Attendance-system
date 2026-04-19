import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Navbar } from '../../navbar/navbar';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, Navbar],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class Register {

  firstName = '';
  lastName = '';
  age: number | null = null;

  mobile = '';
  email = '';

  standard = '';
  dojo = '';
  master = '';

  role = '';

  password = '';
  confirmPassword = '';

  showPassword = false;
  showConfirm = false;

  errorMessage = '';

  constructor(private router: Router) {}

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirm() {
    this.showConfirm = !this.showConfirm;
  }

  onRegister() {

    // VALIDATION
    if (!this.firstName || !this.lastName) {
      this.errorMessage = 'Name is required';
      return;
    }

    if (!this.age || this.age < 5) {
      this.errorMessage = 'Enter valid age';
      return;
    }

    if (!this.email.includes('@')) {
      this.errorMessage = 'Invalid email';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      return;
    }

    if (this.role === 'master') {
      console.log('Master access granted');
    }

    this.errorMessage = '';

    alert('Registration Successful ✅');
    this.router.navigate(['/login']);
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}