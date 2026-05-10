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
  filteredList: any[] = [];
  searchText: string = '';

  private STORAGE_KEY = 'users';

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadUsers();

      // 🔁 Refresh when coming back to page
      window.addEventListener('focus', () => {
        this.loadUsers();
      });
    }
  }

  // =========================
  // LOAD ACCEPTED STUDENTS
  // =========================
  loadUsers(): void {
    const data = localStorage.getItem(this.STORAGE_KEY);
    const allUsers = data ? JSON.parse(data) : [];

    // ✅ MATCH WITH OVERVIEW ("approved")
    this.users = allUsers.filter((user: any) =>
      user.role?.toLowerCase() === 'student' &&
      user.status?.toLowerCase() === 'approved'
    );

    this.filteredList = [...this.users];
  }

  // =========================
  // SEARCH
  // =========================
  onSearch(): void {
    const text = this.searchText.toLowerCase().trim();

    if (!text) {
      this.filteredList = [...this.users];
      return;
    }

    this.filteredList = this.users.filter((user: any) =>
      user.name?.toLowerCase().includes(text) ||
      user.email?.toLowerCase().includes(text) ||
      user.place?.toLowerCase().includes(text)
    );
  }

  // =========================
  // CLEAR SEARCH
  // =========================
  clearSearch(): void {
    this.searchText = '';
    this.filteredList = [...this.users];
  }
}