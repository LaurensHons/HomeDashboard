import { Injectable, OnInit } from '@angular/core';
import { ButtonAction } from '../models/button.action';

@Injectable({
  providedIn: 'root',
})
export class LayoutService {
  sideBarLinks: ButtonAction[] = [
    new ButtonAction({
      displayName: 'Home',
      icon: 'home',
      routerLink: 'home',
    }),
    // new ButtonAction({
    //   displayName: 'About Me',
    //   icon: 'person',
    //   routerLink: 'about',
    // }),
    new ButtonAction({
      displayName: 'Dashboard',
      icon: 'dashboard',
      routerLink: 'dashboard',
    }),
  ];
}
