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

  userId = '';
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

  // VALIDATION
  isFormValid(): boolean {
    return !!(
      this.userId &&
      this.firstName &&
      this.lastName &&
      this.mobile &&
      this.email &&
      this.role &&
      this.password &&
      this.confirmPassword
    );
  }

  // REGISTER
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

    // 🚨 CHECK USER ID DUPLICATE
    const idExists = users.find((u: any) => u.userId === this.userId);
    if (idExists) {
      alert("⚠️ User ID already exists");
      return;
    }

    // 🚨 CHECK EMAIL DUPLICATE
    const emailExists = users.find((u: any) => u.email === this.email);
    if (emailExists) {
      alert("⚠️ Email already registered");
      return;
    }

    const newUser = {
      userId: this.userId,
      firstName: this.firstName,
      lastName: this.lastName,
      mobile: this.mobile,
      email: this.email,
      role: this.role,
      password: this.password
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    alert("✅ Registration Successful!");

    this.router.navigate(['/login']);
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}