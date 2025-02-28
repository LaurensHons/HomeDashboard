import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';
import { rendPNG, steamPNG } from './pngs';
import { GithubButtonComponent } from './github-button/github-button.component';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CardModule, GithubButtonComponent],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss',
})
export class ProjectsComponent {
  steam = steamPNG;
  rendPng = rendPNG;
}
