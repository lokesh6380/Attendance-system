import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedNavbarComponent } from '../shared-navbar/shared-navbar';

@Component({
  selector: 'app-students',
  standalone: true,
  imports: [CommonModule, FormsModule, SharedNavbarComponent],
  templateUrl: './students.html',
  styleUrls: ['./students.css'],
})
export class Students implements OnInit {
  users: any[] = [];
  searchText: string = '';

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.loadUsers();
    }
  }

  loadUsers() {
    const allUsers = JSON.parse(localStorage.getItem('users') || '[]');

    // ✅ Filter only students
    this.users = allUsers.filter((user: any) => user.role === 'student');
  }

  // 🔍 Filter function
  filteredUsers() {
    if (!this.searchText) return this.users;

    return this.users.filter(user =>
      user.name.toLowerCase().includes(this.searchText.toLowerCase()) ||
      user.email.toLowerCase().includes(this.searchText.toLowerCase()) ||
      user.place.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }
}