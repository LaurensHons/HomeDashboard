import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { StateFacade } from '../../../core/state/state.facade';
import { CoreModule } from '../../../core.module';
import { SelectComponent } from '../../../layout/select/select.component';
import { NMBSStation } from '../../../core/models/nmbs.models';
import { BehaviorSubject, Subject, first } from 'rxjs';
import { NMBSFunctionsService } from '../../../core/services/nmbs.functions.service';
import { CookieService } from 'ngx-cookie-service';
import { MultiSelectModule } from 'primeng/multiselect';
import { CustomCookieService } from '../../../../services/cookie.service';
import { CookieKey } from '../../../../services/cookie.helpers';
import {
  AutoCompleteCompleteEvent,
  AutoCompleteModule,
} from 'primeng/autocomplete';

@Component({
  selector: 'app-station-select',
  standalone: true,
  imports: [CoreModule, AutoCompleteModule],
  templateUrl: './station-select.component.html',
  styleUrl: './station-select.component.scss',
})
export class StationSelectComponent implements OnInit {
  @Input() activeStation: NMBSStation | undefined;
  @Output() activeStationChange = new EventEmitter<NMBSStation>();

  stations: NMBSStation[] = [];
  filteredstations: NMBSStation[] = [];

  station = new FormControl<string>('');

  constructor(
    private nmbsFunc: NMBSFunctionsService,
    private cookieService: CustomCookieService
  ) {}

  _favorites: NMBSStation[] = [];

  get favorites() {
    return this._favorites;
  }

  set favorites(v) {
    this.cookieService.setLocalstorage(
      CookieKey.DashboardNMBSFAVORITES,
      v.map((s) => s.id)
    );
  }

  filter($event: AutoCompleteCompleteEvent) {
    const value = $event.query;
    this.filteredstations = this.stations.filter((s) =>
      s.name.toLowerCase().includes(value)
    );
  }

  ngOnInit(): void {
    const stations = this.cookieService.getLocalstorage(
      CookieKey.DashboardNMBSSTATIONCACHE
    );

    if (length != 0) this.initObservable(stations);
    else
      this.nmbsFunc
        .getAllStations()
        .pipe(first())
        .subscribe((stations) => {
          this.initObservable(stations);
        });
  }

  private initObservable(stations: NMBSStation[]) {
    const favorites = this.cookieService.getLocalstorage(
      CookieKey.DashboardNMBSFAVORITES
    );
    this._favorites = favorites
      .map((fav: string) => stations.find((s) => s.id === fav) as NMBSStation)
      .filter((t: NMBSStation) => !!t);
    this.stations = stations;
    this.filteredstations = stations;
  }

  onStationChange(station: NMBSStation) {
    this.activeStation = station;
    this.activeStationChange.emit(station);
  }

  saveFavorite(station: NMBSStation) {
    this.favorites = [station, ...this.favorites];
    this.onStationChange(station);
  }

  removeFavorite(station: NMBSStation) {
    this.favorites = this.favorites.filter(
      (fav: NMBSStation) => fav.id !== station.id
    );
  }
}
