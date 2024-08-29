import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { StateFacade } from '../../../core/state/state.facade';
import { CoreModule } from '../../core.module';
import { SelectComponent } from '../general/select/select.component';
import { NMBSStation } from '../../../core/models/nmbs.models';
import { BehaviorSubject, Subject, first } from 'rxjs';
import { NMBSFunctionsService } from '../../../core/services/nmbs.functions.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-station-select',
  standalone: true,
  imports: [CoreModule, SelectComponent],
  templateUrl: './station-select.component.html',
  styleUrl: './station-select.component.scss',
})
export class StationSelectComponent implements OnInit {
  @Input() activeStation: NMBSStation | undefined;
  @Output() activeStationChange = new EventEmitter<NMBSStation>();

  stations$ = new BehaviorSubject<NMBSStation[]>([]);

  constructor(
    private nmbsFunc: NMBSFunctionsService,
    private cookieService: CookieService
  ) {}

  favorites = new BehaviorSubject<NMBSStation[]>([]);

  ngOnInit(): void {
    this.nmbsFunc
      .getAllStations()
      .pipe(first())
      .subscribe((stations) => {
        this.stations$.next(stations);
        const favorites = JSON.parse(
          this.cookieService.get('favorites') || '[]'
        );
        this.favorites.next(
          favorites.map(
            (fav: string) => stations.find((s) => s.id === fav) as NMBSStation
          )
        );
      });
  }

  onStationChange(station: NMBSStation) {
    this.activeStation = station;
    this.activeStationChange.emit(station);
  }

  saveFavorite(station: NMBSStation) {
    if (this.stations$.value.length === 0) return;
    station.favorite = !station.favorite;
    const cookie = this.cookieService.get('favorites');
    let favorites: string[];
    try {
      favorites = JSON.parse(cookie);
    } catch {
      favorites = [];
      const cookie = this.cookieService.set(
        'favorites',
        JSON.stringify(favorites)
      );
    }
    if (favorites) {
      this.favorites.next(
        favorites.map(
          (fav: string) => this.stations$.value.find((s) => s.id === fav)!
        )
      );
    }
    if (station.favorite && !this.favorites.value.some((fav) => fav.id === station.id)) {
      this.favorites.next([...this.favorites.value, station]);
      this.writeFavorites();
    } else if (!station.favorite){
      this.favorites.next(this.favorites.value.filter(f => f.id == station.id));
      this.writeFavorites();
    }
    console.log('toggled favorite', this.favorites.value);
  }

  removeFavorite(station: NMBSStation) {
    if (this.stations$.value.length === 0) return;
    this.favorites.next(
      this.favorites.value.filter((fav: NMBSStation) => fav.id !== station.id)
    );
    this.writeFavorites();
  }

  writeFavorites() {
    this.cookieService.set(
      'favorites',
      JSON.stringify(this.favorites.value.map((fav: NMBSStation) => fav.id))
    );
  }
}
