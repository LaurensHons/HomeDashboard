import { Component } from '@angular/core';
import { CVbase64 } from './cv.base';

@Component({
  selector: 'app-cv',
  standalone: true,
  imports: [],
  templateUrl: './cv.component.html',
  styleUrl: './cv.component.scss',
})
export class CvComponent {
  source = CVbase64;
}
