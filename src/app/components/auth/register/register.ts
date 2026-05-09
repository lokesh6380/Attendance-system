import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Navbar } from '../../navbar/navbar';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, Navbar],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class Register {

  firstName = '';
  lastName = '';
  mobile = '';
  email = '';
  role = '';
  place = '';
  password = '';
  confirmPassword = '';

  showPassword = false;
  showConfirm = false;

  constructor(private router: Router, @Inject(PLATFORM_ID) private platformId: Object) {}

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirm() {
    this.showConfirm = !this.showConfirm;
  }

  isFormValid(): boolean {
    return !!(
      this.firstName &&
      this.lastName &&
      this.mobile &&
      this.email &&
      this.role &&
      this.place &&
      this.password &&
      this.confirmPassword
    );
  }

  // ✅ Mobile validation (exactly 10 digits)
  isValidMobile(): boolean {
    return /^[0-9]{10}$/.test(this.mobile);
  }

  // ✅ Email validation (basic format)
  isValidEmail(): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email);
  }

  onRegister() {

    if (!this.isFormValid()) {
      alert("⚠️ Fill all fields");
      return;
    }

    // ✅ Mobile check
    if (!this.isValidMobile()) {
      alert("❌ Mobile number must be exactly 10 digits");
      return;
    }

    // ✅ Email check
    if (!this.isValidEmail()) {
      alert("❌ Enter a valid email (example: user@gmail.com)");
      return;
    }

    if (this.password !== this.confirmPassword) {
      alert("❌ Passwords do not match");
      return;
    }

    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    let users = JSON.parse(localStorage.getItem('users') || '[]');

    const emailExists = users.find((u: any) => u.email === this.email);
    if (emailExists) {
      alert("⚠️ Email already exists");
      return;
    }

    users.push({
      firstName: this.firstName,
      lastName: this.lastName,
      name: `${this.firstName} ${this.lastName}`.trim(),
      mobile: this.mobile,
      email: this.email,
      role: this.role.trim().toLowerCase(),
      place: this.place,
      password: this.password,
      status: 'pending'
    });

    localStorage.setItem('users', JSON.stringify(users));

    alert("✅ Registration Successful!");
    this.router.navigate(['/login']);
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}