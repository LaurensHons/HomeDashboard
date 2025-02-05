import { AfterViewInit, Component } from '@angular/core';
import { Router } from '@angular/router';
import { DashboardComponent, DashboardService } from 'home-modules';
import { AppService } from '../../app.service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-dashboard-wrapper',
  standalone: true,
  imports: [DashboardComponent, AsyncPipe],
  templateUrl: './dashboard-wrapper.component.html',
  styleUrl: './dashboard-wrapper.component.scss',
})
export class DashboardWrapperComponent implements AfterViewInit {
  constructor(
    private router: Router,
    private dash: DashboardService,
    public appService: AppService
  ) {}

  ngAfterViewInit(): void {
    this.dash.initDefaultCookie();
  }

  goToDashboard() {
    this.router.navigate(['dash']);
  }
}
