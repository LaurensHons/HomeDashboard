import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { Title } from 'chart.js';
import { TimelineModule } from 'primeng/timeline';
import { CvComponent } from './cv/cv.component';
import { TimelineComponent } from './timeline/timeline.component';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, MatTabsModule, TimelineComponent, CvComponent],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss',
})
export class AboutComponent {}
