import { Routes } from '@angular/router';

import { LoginComponent } from './components/auth/login/login';
import { Register } from './components/auth/register/register';
import { Guards } from './components/guards/guards';
import { Dashboard } from './components/dashboard/dashboard';
import { Students } from './components/students/students';
import { Attendance } from './components/attendance/attendance';
import { Reports } from './components/reports/reports';
import { LandingPageComponent } from './components/landing-page/landing-page';
import { Navbar } from './components/navbar/navbar';

export const routes: Routes = [
  { path: '', component: LandingPageComponent },

  // Auth routes
  { path: 'login', component: LoginComponent },
  { path: 'register', component: Register },

  // Main app routes
  { path: 'dashboard', component: Dashboard },
  { path: 'students', component: Students },
  { path: 'attendance', component: Attendance },
  { path: 'reports', component: Reports },
  {path:'navbar',component:Navbar},
  // Wildcard (must be last)
  { path: '**', redirectTo: 'landing', pathMatch: 'full' }
];