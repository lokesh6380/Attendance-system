import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedNavbarComponent } from '../shared-navbar/shared-navbar';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, SharedNavbarComponent],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css']
})
export class Profile implements OnInit {

  user: any = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    department: '',
    experience: '',
    profilePic: '',
    password: ''
  };

  newPassword: string = '';
  confirmPassword: string = '';

  toastMessage: string = '';
  toastType: 'success' | 'error' | '' = '';

  // 🔥 LOAD USER
  ngOnInit() {
    const loggedInUser = localStorage.getItem('currentUser');

    if (loggedInUser) {
      this.user = JSON.parse(loggedInUser);
    } else {
      this.showToast('No user found. Please login again.', 'error');
    }

    console.log('User Loaded:', this.user);
  }

  // 📸 IMAGE UPLOAD + SAVE
  onImageUpload(event: any) {
    const file = event.target.files[0];

    if (file) {

      // 🔒 FILE SIZE VALIDATION (2MB)
      if (file.size > 2 * 1024 * 1024) {
        this.showToast('Image must be less than 2MB', 'error');
        return;
      }

      const reader = new FileReader();

      reader.onload = () => {
        this.user.profilePic = reader.result as string;

        // 🔥 SAVE AFTER IMAGE UPLOAD
        this.saveUserData();

        this.showToast('Profile image updated!', 'success');
      };

      reader.readAsDataURL(file);
    }
  }

  // 💾 COMMON SAVE FUNCTION
  saveUserData() {
    let users = JSON.parse(localStorage.getItem('users') || '[]');

    let userFound = false;

    users = users.map((u: any) => {
      if (u.email === this.user.email) {
        userFound = true;
        return { ...u, ...this.user }; // merge all fields
      }
      return u;
    });

    // 🔥 IF USER NOT FOUND (EDGE CASE)
    if (!userFound) {
      users.push(this.user);
    }

    // SAVE USERS ARRAY
    localStorage.setItem('users', JSON.stringify(users));

    // SAVE CURRENT USER
    localStorage.setItem('currentUser', JSON.stringify(this.user));
  }

  // 🔥 TOAST FUNCTION
  showToast(message: string, type: 'success' | 'error') {
    this.toastMessage = message;
    this.toastType = type;

    setTimeout(() => {
      this.toastMessage = '';
      this.toastType = '';
    }, 3000);
  }

  // 🔄 UPDATE PROFILE
  updateProfile() {

    // ✅ NAME VALIDATION
    if (!this.user.firstName || !this.user.lastName) {
      this.showToast('Name fields cannot be empty!', 'error');
      return;
    }

    // ✅ PASSWORD VALIDATION
    if (this.newPassword || this.confirmPassword) {

      if (this.newPassword.length < 6) {
        this.showToast('Password must be at least 6 characters!', 'error');
        return;
      }

      if (this.newPassword !== this.confirmPassword) {
        this.showToast('Passwords do not match!', 'error');
        return;
      }

      // 🔐 UPDATE PASSWORD
      this.user.password = this.newPassword;
    }

    // 🔥 SAVE ALL DATA (INCLUDING IMAGE)
    this.saveUserData();

    // 🔄 RESET PASSWORD FIELDS
    this.newPassword = '';
    this.confirmPassword = '';

    this.showToast('Profile updated successfully!', 'success');
  }
}