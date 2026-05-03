import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedNavbarComponent } from '../shared-navbar/shared-navbar';
@Component({
  selector: 'app-students',
  standalone: true,
  imports: [CommonModule, SharedNavbarComponent],
  templateUrl: './students.html',
  styleUrls: ['./students.css'],
})
export class Students {}
