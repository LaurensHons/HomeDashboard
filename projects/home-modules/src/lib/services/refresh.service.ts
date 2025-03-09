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
  repeat,
  of,
  withLatestFrom,
  combineLatestWith,
  filter,
  combineLatest,
} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RefreshService implements OnDestroy {
  timeoutSeconds = 30;
  timeout = new BehaviorSubject<number>(0);
  public timeoutPercentage = new BehaviorSubject<number>(0);

  public refresh = new Subject<void>();
  public stopped = new Subject<boolean>();

  constructor() {
    combineLatest([this.stopped, repeat({ delay: 1000 })(of(true))])
      .pipe(filter(([stopped]) => !stopped))
      .subscribe(() => {
        if (this.timeout.value >= this.timeoutSeconds) {
          this.refresh.next();
          this.timeout.next(0);
        } else {
          this.timeout.next(this.timeout.value + 1);
        }
      });

    this.timeout.pipe(takeUntil(this.destroy$)).subscribe((delay) => {
      this.timeoutPercentage.next(100 - (delay / this.timeoutSeconds) * 100);
    });

    this.stopped.next(false);
  }

  refreshTimer() {
    this.timeout.next(0);
  }

  destroy$ = new Subject<void>();
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
