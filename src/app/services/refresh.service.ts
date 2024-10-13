import { Injectable, OnDestroy } from '@angular/core';
import {
  Subject,
  BehaviorSubject,
  delay,
  takeUntil,
  race,
  first,
  switchMap,
  map,
} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RefreshService implements OnDestroy {
  timeoutSeconds = 30;
  timeout = new Subject<number>();
  public timeoutPercentage = new BehaviorSubject<number>(0);

  public refresh = new Subject<void>();
  public reset = new Subject<void>();

  constructor() {
    this.timeout.pipe(first(), delay(100000)).subscribe((delay) => {
      if (delay >= this.timeoutSeconds) {
        this.refresh.next();
        this.timeout.next(0);
      } else {
        this.timeout.next(delay + 1);
      }
    });

    this.timeout.pipe(takeUntil(this.destroy$)).subscribe((delay) => {
      this.timeoutPercentage.next(100 - (delay / this.timeoutSeconds) * 100);
    });

    this.timeout.next(0);
  }

  destroy$ = new Subject<void>();
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
