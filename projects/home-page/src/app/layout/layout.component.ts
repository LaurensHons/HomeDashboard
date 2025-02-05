import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ButtonAction } from '../core/models/button.action';
import { LayoutService } from '../core/services/layout.service';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { CookieKey, CustomCookieService } from 'home-modules';
import { MatMenuModule } from '@angular/material/menu';
import { AppService } from '../app.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatSidenavModule,
    MatButtonModule,
    MatToolbarModule,
    MatListModule,
    MatMenuModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
})
export class LayoutComponent implements OnInit {
  constructor(
    public layoutService: LayoutService,
    private observer: BreakpointObserver,
    private router: Router,
    private cookieService: CustomCookieService,
    public appService: AppService
  ) {}

  @ViewChild(MatSidenav) sidenav!: MatSidenav;
  isMobile = true;
  isCollapsed = true;
  isDarkMode!: boolean;

  ngOnInit() {
    this.setDarkMode(this.cookieService.getCookie(CookieKey.DashboardDarkMode));
    this.observer.observe(['(max-width: 800px)']).subscribe((screenSize) => {
      if (screenSize.matches) {
        this.isMobile = true;
      } else {
        this.isMobile = false;
      }
    });
  }

  setDarkMode(isDarkMode: boolean) {
    this.isDarkMode = isDarkMode;
    this.cookieService.setCookie(CookieKey.DashboardDarkMode, isDarkMode);
    if (isDarkMode) {
      document.body.id = 'dark-theme';
    } else {
      document.body.id = '';
    }
  }

  toggleMenu() {
    if (this.isMobile) {
      this.sidenav.toggle();
      this.isCollapsed = false;
    } else {
      this.sidenav.open();
      this.isCollapsed = !this.isCollapsed;
    }
  }

  OnClick(nav: ButtonAction) {
    console.log(nav);
    if (nav.routerLink) this.router.navigate([nav.routerLink]);
    if (nav.onClick) nav.onClick();
  }
}
