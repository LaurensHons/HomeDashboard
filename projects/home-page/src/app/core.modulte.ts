import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { CookieService } from 'ngx-cookie-service';
import { MatButtonModule } from '@angular/material/button';
import { TimelineModule } from 'primeng/timeline';
import { ChartModule } from 'primeng/chart';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ProgressBarModule } from 'primeng/progressbar';
import {
  componentEffects,
  componentFeatureKey,
  componentReducers,
} from '../../../home-modules/src/public-api';

@NgModule({
  providers: [CookieService],
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    StoreModule.forFeature(componentFeatureKey, componentReducers),
    // EffectsModule.forFeature(componentEffects),
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatOptionModule,
    MatTabsModule,
    MatProgressSpinnerModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatButtonModule,
    TimelineModule,
    ChartModule,
    MatProgressBarModule,
    ProgressBarModule,
  ],
  exports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatOptionModule,
    MatTabsModule,
    MatProgressSpinnerModule,
    MatNativeDateModule,
    MatIconModule,
    MatButtonModule,
    TimelineModule,
    ChartModule,
    MatProgressBarModule,
    ProgressBarModule,
  ],
})
export class CoreModule {}
