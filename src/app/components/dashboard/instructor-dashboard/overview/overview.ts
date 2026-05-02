import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedNavbarComponent } from '../shared-navbar/shared-navbar';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [CommonModule, FormsModule, SharedNavbarComponent],
  templateUrl: './overview.html',
  styleUrls: ['./overview.css']
})
export class OverviewComponent implements OnInit {

  students: any[] = [];

  // 🔍 search
  searchText: string = '';

  // 📄 pagination
  currentPage: number = 1;
  pageSize: number = 5;

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
  }

  ngOnInit(): void {
    this.loadStudents();
  }

  // =========================
  // LOAD DATA
  // =========================
  loadStudents() {
    if (!this.isBrowser()) return;

    const data = localStorage.getItem('users');
    const parsed = data ? JSON.parse(data) : [];

    const registeredUsers = parsed.map((user: any, index: number) => ({
      id: user.id ?? index + 1,
      name: (user.name ?? `${user.firstName || ''} ${user.lastName || ''}`.trim()) || user.email,
      email: user.email,
      mobile: user.mobile ?? '',
      status: user.status ?? ((user.role || '').toString().toLowerCase() === 'student' ? 'pending' : 'approved'),
      role: user.role ?? 'student',
      roleLabel: this.formatRole(user.role),
      ...user
    }));

    this.students = registeredUsers;
  }

  formatRole(role: any): string {
    const value = (role || '').toString().trim();
    return value
      .split(/\s+/)
      .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }

  saveStudents() {
    if (!this.isBrowser()) return;

    const allUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const updatedUsers = allUsers.map((user: any) => {
      const storedUser = this.students.find((s: any) => s.email === user.email);
      return storedUser ? { ...user, status: storedUser.status } : user;
    });

    localStorage.setItem('users', JSON.stringify(updatedUsers));
  }

  // =========================
  // FILTERED DATA (SEARCH)
  // =========================
  get filteredStudents() {
    return this.students.filter(s =>
      s.name?.toLowerCase().includes(this.searchText.toLowerCase()) ||
      s.email?.toLowerCase().includes(this.searchText.toLowerCase()) ||
      s.role?.toLowerCase().includes(this.searchText.toLowerCase()) ||
      s.mobile?.toString().toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  // =========================
  // PAGINATION DATA
  // =========================
  get paginatedStudents() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredStudents.slice(start, start + this.pageSize);
  }

  get totalPages() {
    return Math.ceil(this.filteredStudents.length / this.pageSize);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) this.currentPage++;
  }

  prevPage() {
    if (this.currentPage > 1) this.currentPage--;
  }

  goToPage(page: number) {
    this.currentPage = page;
  }

  // =========================
  // STATS
  // =========================
  get totalStudents(): number {
    return this.students.length;
  }

  get approvedStudents(): number {
    return this.students.filter(s => s.status === 'approved').length;
  }

  get pendingStudents(): number {
    return this.students.filter(s => s.status === 'pending').length;
  }

  get pendingPercentage(): number {
    if (this.students.length === 0) return 0;
    return Math.round((this.pendingStudents / this.totalStudents) * 100);
  }

  // =========================
  // ACTIONS
  // =========================
  acceptStudent(student: any) {
    const found = this.students.find(s => s.id === student.id);
    if (found) {
      found.status = 'approved';
      this.saveStudents();
    }
  }

  deleteStudent(student: any) {
    this.students = this.students.filter(s => s.id !== student.id);
    this.saveStudents();
  }
}