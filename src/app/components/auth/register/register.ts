import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Navbar } from '../../navbar/navbar';

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
  password = '';
  confirmPassword = '';

  showPassword = false;
  showConfirm = false;

  constructor(private router: Router) {}

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
      this.password &&
      this.confirmPassword
    );
  }

  onRegister() {

    if (!this.isFormValid()) {
      alert("⚠️ Fill all fields");
      return;
    }

    if (this.password !== this.confirmPassword) {
      alert("❌ Passwords do not match");
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
      mobile: this.mobile,
      email: this.email,
      role: this.role,
      password: this.password
    });

    localStorage.setItem('users', JSON.stringify(users));

    alert("✅ Registration Successful!");
    this.router.navigate(['/login']);
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
// this is register component