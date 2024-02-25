import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { CoreModule } from './core.module';
import { StyleService } from './services/style.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CoreModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'home-dashboard';

  constructor(private router: Router, private style: StyleService) {}

  goToDashboard() {
    this.router.navigate(['dash']);
  }
}
