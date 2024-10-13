import { AfterViewInit, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { CoreModule } from './core.module';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { DashboardService } from './services/dashboard.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CoreModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements AfterViewInit {
  title = 'home-dashboard';

  constructor(private router: Router, private dash: DashboardService) {}
  ngAfterViewInit(): void {
    this.dash.initDefaultCookie();
  }

  goToDashboard() {
    this.router.navigate(['dash']);
  }
}
