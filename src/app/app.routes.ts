import { Routes } from '@angular/router';

import { Login } from './components/auth/login/login';
import { Register } from './components/auth/register/register';
import { Guards } from './components/guards/guards';
import { Dashboard } from './components/dashboard/dashboard';
import { Students } from './components/students/students';
import { Attendance } from './components/attendance/attendance';
import { Reports } from './components/reports/reports';
import { LandingPageComponent } from './components/landing-page/landing-page';
import { Navbar } from './components/navbar/navbar';
import { InstructorDashboard } from './components/dashboard/instructor-dashboard/instructor-dashboard';
import { OverviewComponent } from './components/dashboard/instructor-dashboard/overview/overview';
import { Students as InstructorStudents } from './components/dashboard/instructor-dashboard/students/students';
import { Profile } from './components/dashboard/instructor-dashboard/profile/profile';
import { StudentDashboard } from './components/dashboard/student-dashboard/student-dashboard';
export const routes: Routes = [
  { path: '', component: LandingPageComponent },

  // Auth routes
  { path: 'login', component: Login },
  { path: 'register', component: Register },

  // Instructor Dashboard
  { path: 'instructor-dashboard', component: InstructorDashboard, children: [
    { path: 'overview', component: OverviewComponent },
    { path: 'profile', component: Profile },
    { path: 'students', component: InstructorStudents },
    { path: '', redirectTo: 'overview', pathMatch: 'full' }
  ]},

  // Student Dashboard
  { path: 'student-dashboard', component: StudentDashboard },

  // Sub-master Dashboard (same as student for now)
  { path: 'submaster-dashboard', component: StudentDashboard },

  // Main app routes
  { path: 'dashboard', component: Dashboard },
  { path: 'students', component: Students },
  { path: 'attendance', component: Attendance },
  { path: 'reports', component: Reports },
  {path:'navbar',component:Navbar},
  // Wildcard (must be last)
  { path: '**', redirectTo: 'landing', pathMatch: 'full' }
];