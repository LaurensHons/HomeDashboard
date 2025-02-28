import { Routes } from '@angular/router';
import { DashboardComponent } from '../../../home-modules/src/public-api';
import { DashboardWrapperComponent } from './pages/dashboard-wrapper/dashboard-wrapper.component';
import { HomeComponent } from './pages/home/home.component';
import { AboutComponent } from './pages/about/about.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'about',
    component: AboutComponent,
  },
  {
    path: 'home',
    component: HomeComponent,
  },

  {
    path: 'dashboard',
    component: DashboardWrapperComponent,
  },
];
