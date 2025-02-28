import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-github-button',
  standalone: true,
  imports: [],
  templateUrl: './github-button.component.html',
  styleUrl: './github-button.component.scss',
})
export class GithubButtonComponent {
  @Input() link!: string;
}
