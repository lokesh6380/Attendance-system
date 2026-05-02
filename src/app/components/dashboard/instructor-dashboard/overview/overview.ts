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

  searchText: string = '';

  currentPage: number = 1;
  pageSize: number = 5;

  private STORAGE_KEY = 'users';

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
  }

  ngOnInit(): void {
    this.loadStudents();
  }

  // =========================
  // LOAD FROM LOCALSTORAGE
  // =========================
  loadStudents() {
    if (!this.isBrowser()) return;

    const data = localStorage.getItem(this.STORAGE_KEY);
    const parsed = data ? JSON.parse(data) : [];

    this.students = parsed.map((user: any, index: number) => ({
      id: user.id ?? index + 1,
      name: (user.name ?? `${user.firstName || ''} ${user.lastName || ''}`.trim()) || user.email,
      email: user.email,
      mobile: user.mobile ?? '',
      status: user.status ?? 'pending',
      role: user.role ?? 'student',
      roleLabel: this.formatRole(user.role)
    }));
  }

  // =========================
  // SAVE TO LOCALSTORAGE
  // =========================
  saveToStorage() {
    if (!this.isBrowser()) return;

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.students));
  }

  // =========================
  // FORMAT ROLE
  // =========================
  formatRole(role: any): string {
    const value = (role || '').toString().trim();
    return value
      .split(/\s+/)
      .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }

  // =========================
  // FILTER
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
  // PAGINATION
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
  // ACCEPT
  // =========================
  acceptStudent(student: any) {
    const found = this.students.find(s => s.id === student.id);
    if (found) {
      found.status = 'approved';
      this.saveToStorage(); // 🔥 persist change
    }
  }

  // =========================
  // DELETE (FULL PERSISTENCE FIX)
  // =========================
  deleteStudent(student: any) {
    this.students = this.students.filter(s => s.id !== student.id);
    this.saveToStorage(); // 🔥 updates localStorage permanently
  }
}