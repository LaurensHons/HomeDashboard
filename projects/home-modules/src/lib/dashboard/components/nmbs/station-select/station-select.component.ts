import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import {
  AutoCompleteCompleteEvent,
  AutoCompleteModule,
} from 'primeng/autocomplete';
import { Subject, takeUntil, withLatestFrom } from 'rxjs';
import { CookieKey } from '../../../../services/cookie.helpers';
import { CustomCookieService } from '../../../../services/cookie.service';
import { CoreModule } from '../../../core.module';
import { NMBSStation } from '../../../core/models/nmbs.models';
import { StateFacade } from '../../../core/state/state.facade';

@Component({
  selector: 'app-station-select',
  standalone: true,
  imports: [CoreModule, AutoCompleteModule],
  templateUrl: './station-select.component.html',
  styleUrl: './station-select.component.scss',
})
export class StationSelectComponent implements OnInit, OnDestroy {
  @Input() activeStation: NMBSStation | undefined;
  @Output() activeStationChange = new EventEmitter<NMBSStation>();

  stations: NMBSStation[] = [];
  filteredstations: NMBSStation[] = [];

  stationFilter = new FormControl<string>('');

  constructor(
    private fac: StateFacade,
    private cookieService: CustomCookieService
  ) {}

  _favorites: NMBSStation[] = [];

  get storedStationFavorites() {
    return this.cookieService.getCookieObject<string[]>(
      CookieKey.DashboardNMBSFAVORITES
    );
  }

  filter($event: AutoCompleteCompleteEvent) {
    const value = $event.query;
    this.filteredstations = this.stations.filter((s) =>
      s.name.toLowerCase().includes(value)
    );
  }

  ngOnInit(): void {
    this.fac.getNMBSStations();

    this.fac.stations$
      .pipe(
        takeUntil(this.destroy$),
        withLatestFrom(this.stationFilter.valueChanges)
      )
      .subscribe(([stations, filter]) => {
        if (!filter) this.filteredstations = stations;
        else
          this.filteredstations = stations.filter(
            (s) => s.name.indexOf(filter) != -1
          );
      });

    this.fac.stations$
      .pipe(
        takeUntil(this.destroy$),
        withLatestFrom(
          this.cookieService.observeCookie(CookieKey.DashboardNMBSFAVORITES)
        )
      )
      .subscribe(([stations, favorite_ids]) => {
        this._favorites = stations.filter((s) => favorite_ids?.includes(s.id));
      });
  }

  onStationChange(station: NMBSStation) {
    this.activeStation = station;
    this.activeStationChange.emit(station);
  }

  removeFavorite(station: NMBSStation) {
    var favorite_ids = this.cookieService
      .getCookieObject<string[]>(CookieKey.DashboardNMBSFAVORITES)
      .filter((fav) => fav !== station.id);

    this.cookieService.setCookieObject(
      CookieKey.DashboardNMBSFAVORITES,
      favorite_ids
    );
  }

  destroy$ = new Subject<void>();
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
