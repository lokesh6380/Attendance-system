import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedNavbarComponent } from '../shared-navbar/shared-navbar';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [CommonModule, SharedNavbarComponent],
  templateUrl: './overview.html',
  styleUrls: ['./overview.css']
})
export class OverviewComponent implements OnInit {

  students: any[] = [];

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
  }

  ngOnInit(): void {
    this.loadStudents();
  }

  // 🔹 Load from localStorage
  loadStudents() {
    if (!this.isBrowser()) {
      this.students = [];
      return;
    }

    const data = localStorage.getItem('students'); // change key if needed
    this.students = data ? JSON.parse(data) : [];
  }

  // 🔹 Save back to localStorage
  saveStudents() {
    if (!this.isBrowser()) {
      return;
    }

    localStorage.setItem('students', JSON.stringify(this.students));
  }

  // 🔹 Stats
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

  // 🔹 Accept student (used by instructor dashboard logic)
  acceptStudent(student: any) {
    const found = this.students.find(s => s.id === student.id);
    if (found) {
      found.status = 'approved';
      this.saveStudents();
    }
  }

  // 🔹 Delete student
  deleteStudent(student: any) {
    this.students = this.students.filter(s => s.id !== student.id);
    this.saveStudents();
  }
}