import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AppDrawerComponent } from './app-drawer/app-drawer.component';
import { TimelineComponent } from '../about/timeline/timeline.component';
import { ProjectsComponent } from '../about/projects/projects.component';
import { CvComponent } from '../about/cv/cv.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    AppDrawerComponent,
    TimelineComponent,
    ProjectsComponent,
    CvComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {}
